import {Component, OnInit} from "@angular/core";
import {GrowlService} from "./services/growl.service";
import {Message} from "primeng/api";
import {PaccurateService} from "./services/paccurate.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent implements OnInit {
  messages: Array<Message> = [];
  formToggled = true;

  constructor(private growlService: GrowlService,
              private paccurateService: PaccurateService) {
  }

  ngOnInit(): void {
    this.growlService.messageAdded.subscribe(
      (message: Message): void => {
        this.messages.push(message);
      },
      (error: Error): void => {
        console.error(error);
      }
    );
  }

  onFormToggled($event) {
    this.formToggled = !this.formToggled;
    this.paccurateService.emitFormToggled(this.formToggled);
  }
}
