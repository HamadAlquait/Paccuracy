import {AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener} from "@angular/core";
import * as THREE from "three";
import "./js/EnableThreeExamples";
import {PaccurateResponse} from "../model/model";
import "three/examples/js/controls/OrbitControls";
import "three/examples/js/loaders/ColladaLoader";

@Component({
  selector: "app-three-js",
  templateUrl: "./three-js.component.html",
  styleUrls: ["./three-js.component.scss"]
})
export class ThreeJsComponent implements AfterViewInit {

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  @Input() paccurateResponse: PaccurateResponse;

  public fieldOfView: number = 60;
  public nearClippingPane: number = 1;
  public farClippingPane: number = 1100;

  public controls: THREE.OrbitControls;

  @ViewChild("canvas")
  private canvasRef: ElementRef;

  constructor() {
    this.render = this.render.bind(this);
    // this.onModelLoadingCompleted = this.onModelLoadingCompleted.bind(this);
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(200));

    this.paccurateResponse.boxes.forEach(
      (boxWrapper) => {
        let geometry = new THREE.BoxGeometry(boxWrapper.box.dimensions.z, boxWrapper.box.dimensions.x, boxWrapper.box.dimensions.y),
          material = new THREE.MeshBasicMaterial({color: 666, wireframe: true});
        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(boxWrapper.box.dimensions.z / 2, boxWrapper.box.dimensions.x / 2, boxWrapper.box.dimensions.y / 2);
        this.scene.add(cube);
        boxWrapper.box.items.forEach(
          (itemWrapper) => {
            let geometry = new THREE.BoxGeometry(itemWrapper.item.dimensions.z, itemWrapper.item.dimensions.x, itemWrapper.item.dimensions.y),
              material = new THREE.MeshBasicMaterial({color: itemWrapper.item.color, wireframe: true});
            let cube = new THREE.Mesh(geometry, material);
            cube.position.set(itemWrapper.item.origin.z + itemWrapper.item.dimensions.z / 2, itemWrapper.item.origin.x + itemWrapper.item.dimensions.x / 2, itemWrapper.item.origin.y + itemWrapper.item.dimensions.y / 2);
            this.scene.add(cube);
          }
        );
      }
    );
  }

  private createLight() {
    var light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 0, 100);
    this.scene.add(light);

    var light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 0, -100);
    this.scene.add(light);
  }

  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );

    // Set position and look at
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 100;
  }

  private getAspectRatio(): number {
    let height = this.canvas.clientHeight;
    if (height === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRendering() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.autoClear = true;

    let component: ThreeJsComponent = this;

    (function render() {
      //requestAnimationFrame(render);
      component.render();
    }());
  }

  public render() {
    // this.renderer.render(this.scene, this.camera);
    let self: ThreeJsComponent = this;
    self.renderer.render(this.scene, this.camera);
  }

  public addControls() {
    this.controls = new THREE.OrbitControls(this.camera, document.getElementById("three-canvas"));
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.addEventListener("change", this.render);

  }

  /* EVENTS */

  public onMouseDown(event: MouseEvent) {
    console.log("onMouseDown");
    event.preventDefault();

    // Example of mesh selection/pick:
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera);

    let obj: THREE.Object3D[] = [];
    this.findAllObjects(obj, this.scene);
    let intersects = raycaster.intersectObjects(obj);
    console.log("Scene has " + obj.length + " objects");
    console.log(intersects.length + " intersected objects found");
    intersects.forEach((i) => {
      console.log(i.object); // do what you want to do with object
    });

  }

  private findAllObjects(pred: THREE.Object3D[], parent: THREE.Object3D) {
    // NOTE: Better to keep separate array of selected objects
    if (parent.children.length > 0) {
      parent.children.forEach((i) => {
        pred.push(i);
        this.findAllObjects(pred, i);
      });
    }
  }

  public onMouseUp(event: MouseEvent) {
    console.log("onMouseUp");
  }


  @HostListener("window:resize", ["$event"])
  public onResize(event: Event) {
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);

    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.render();
  }

  @HostListener("document:keypress", ["$event"])
  public onKeyPress(event: KeyboardEvent) {
    console.log("onKeyPress: " + event.key);
  }

  /* LIFECYCLE */
  ngAfterViewInit() {
    this.createScene();
    this.createLight();
    this.createCamera();
    this.startRendering();
    this.addControls();
  }

}