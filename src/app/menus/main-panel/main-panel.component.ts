import { Component } from '@angular/core';
import { WebsiteInformation } from '../../models/website-information/website-information';

@Component({
  selector: 'app-main-panel',
  standalone: true,
  imports: [],
  templateUrl: './main-panel.component.html',
  styleUrl: './main-panel.component.scss'
})
export class MainPanelComponent {
  projectList: WebsiteInformation[];

  // Create constructor

  ngOnInit() {
    let datePublished = new Date;

    // TODO: move all to JSON
    const billydecaySite = {
      name: "Personal site (down)",
      websiteLink: "https://billydecay.com",
      logoURL: "",
      description: "My website",
      datePublished: datePublished,
      codebaseLink: "github",
      collaborators: [""]
    }

    const mcSite = {
      name: "Artist Porfolio (WIP)",
      websiteLink: "https://killerkuff.com",
      logoURL: "",
      description: "A portfolio website for artist Mike Cuff",
      datePublished: datePublished,
      codebaseLink: "github",
      collaborators: [""]
    }

    const authorPortfolioSite = {
      name: "Author Portfolio (down)",
      websiteLink: "#",
      logoURL: "",
      description: "Defunct author website",
      datePublished: datePublished,
      codebaseLink: "github",
      collaborators: [""]
    }

    this.projectList = [billydecaySite, mcSite, authorPortfolioSite];
  }
}
