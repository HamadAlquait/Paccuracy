import {Component, ElementRef, OnInit, QueryList, ViewChildren} from "@angular/core";
import {PaccurateResponse} from "../../model/model";
import {PaccurateService} from "../../services/paccurate.service";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/mergeMap";
import {GrowlService} from "../../services/growl.service";
import {Message} from "primeng/api";

@Component({
  selector: "app-paccurate-response-view",
  templateUrl: "./paccurate-response-view.component.html",
  styleUrls: ["./paccurate-response-view.component.scss"]
})
export class PaccurateResponseViewComponent implements OnInit {
  public paccurateResponse: PaccurateResponse;
  public loading: boolean;
  public requestSubmitted: boolean;

  @ViewChildren("svgs") svgs: QueryList<ElementRef> = new QueryList<ElementRef>();

  constructor(private paccurateService: PaccurateService,
              private growlService: GrowlService) {
  }

  ngOnInit(): void {
    this.requestSubmitted = false;
    this.loading = true;

    this.paccurateService.paccurateRequestSubmittedObs.subscribe(
      (): void => {
        this.requestSubmitted = true;
      }
    );

    this.paccurateService.paccurateResponseObs
      .filter(data => !!data)
      .mergeMap((response: PaccurateResponse) => {
        this.paccurateResponse = response;
        this.loading = false;

        if (response.lenLeftovers === 0) {
          this.growlService.add({
            severity: "success",
            summary: "Success",
            detail: "Packaging successful!"
          });
        } else {
          this.growlService.add({
            severity: "error",
            summary: "Failure",
            detail: "Packaging failed!"
          });
        }

        return this.svgs.changes;
      })
      .subscribe(data => {
        console.log(data);
        this.svgs.forEach(
          (svg, i) => {
            svg.nativeElement.style = "transform: translateY(0px); transition: all 0.5s ease-in-out";
            svg.nativeElement.innerHTML = this.paccurateResponse.svgs[i];
          }
        );
      });
  }
}
