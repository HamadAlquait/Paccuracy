export class PaccurateRequest {
  public itemSets: Array<ItemSet> = [];
  public boxTypes: Array<BoxType> = [];
  public includeScripts: boolean = false;

  public constructor(itemSets: Array<ItemSet>, boxTypes: Array<BoxType>, includeScripts: boolean) {
    this.itemSets = itemSets;
    this.boxTypes = boxTypes;
    this.includeScripts = includeScripts;
  }
}

export class ItemSet {
  public refId: number;
  public color: string;
  public weight: number = 0;
  public dimensions: Coordinates;
  public quantity: number;
  public name: string;

  public constructor(refId: number, color: string, weight: number, dimensions: Coordinates, quantity: number, name: string) {
    this.refId = refId;
    this.color = color;
    this.weight = weight;
    this.dimensions = dimensions;
    this.quantity = quantity;
    this.name = name;
  }
}

export class Coordinates {
  public x: number;
  public y: number;
  public z: number;

  public constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class BoxType {
  public weightMax: number = 0;
  public name: string;
  public dimensions: Coordinates;

  public constructor(weightMax: number, name: string, dimensions: Coordinates) {
    this.weightMax = weightMax;
    this.name = name;
    this.dimensions = dimensions;
  }
}

export class PaccurateResponse {
  public boxes: Array<BoxWrapper> = [];
  public leftovers: Array<ItemWrapper> = [];
  public lenBoxes: number;
  public lentItems: number;
  public lenLeftovers: number;
  public svgs: Array<string> = [];

  public constructor(boxes: Array<BoxWrapper>, leftovers: Array<ItemWrapper>, lenBoxes: number, lentItems: number, lenLeftovers: number, svgs: Array<string>) {
    this.boxes = boxes;
    this.leftovers = leftovers;
    this.lenBoxes = lenBoxes;
    this.lentItems = lentItems;
    this.lenLeftovers = lenLeftovers;
    this.svgs = svgs;
  }
}

export class BoxWrapper {
  public box: Box;

  public constructor(box: Box) {
    this.box = box;
  }
}

export class Box {
  public dimensions: Coordinates;
  public id: number;
  public items: Array<ItemWrapper> = [];
  public name: string;
  public volumeMax: number;
  public volumeRemaining: number;
  public volumeUsed: number;
  public volumeUtilization: number;
  public weightMax: number;
  public weightNet: number;
  public weightRemaining: number;
  public weightUsed: number;
  public weightUtilization: number;

  public constructor(dimensions: Coordinates, id: number, items: Array<ItemWrapper>, name: string, volumeMax: number, volumeRemaining: number, volumeUsed: number, volumeUtilization: number, weightMax: number, weightNet: number, weightRemaining: number, weightUsed: number, weightUtilization: number) {
    this.dimensions = dimensions;
    this.id = id;
    this.items = items;
    this.name = name;
    this.volumeMax = volumeMax;
    this.volumeRemaining = volumeRemaining;
    this.volumeUsed = volumeUsed;
    this.volumeUtilization = volumeUtilization;
    this.weightMax = weightMax;
    this.weightNet = weightNet;
    this.weightRemaining = weightRemaining;
    this.weightUsed = weightUsed;
    this.weightUtilization = weightUtilization;
  }
}

export class ItemWrapper {
  public item: Item;

  public constructor(item: Item) {
    this.item = item;
  }
}

export class Item {
  public color: string;
  public dimensions: Coordinates;
  public index: number;
  public message: string;
  public name: string;
  public origin: Coordinates;
  public refId: number;
  public weight: number;

  public constructor(color: string, dimensions: Coordinates, index: number, message: string, name: string, origin: Coordinates, refId: number, weight: number) {
    this.color = color;
    this.dimensions = dimensions;
    this.index = index;
    this.message = message;
    this.name = name;
    this.origin = origin;
    this.refId = refId;
    this.weight = weight;
  }
}