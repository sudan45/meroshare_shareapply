/// <reference types="Cypress" />

describe("Login Module Test", () => {
  beforeEach(() => {
    cy.visit("https://meroshare.cdsc.com.np/#/login");
  });
  it("should convert CSV to JSON and save it", () => {
    cy.readFile("cypress/e2e/share.csv").then((csvContent) => {
      const lines = csvContent.split("\n");
      const headers = lines[0]
        .split(",")
        .map((header) => header.replace("\r", ""));

      const jsonData = lines.slice(1).map((line) => {
        const values = line.split(",").map((value) => value.replace("\r", ""));
        return headers.reduce((acc, header, index) => {
          acc[header] = values[index];
          return acc;
        }, {});
      });

      cy.writeFile(
        "cypress/fixtures/login_credential.json",
        JSON.stringify(jsonData, null, 2)
      );
    });
  });

  it("To Login", () => {
    cy.fixture("login_credential.json").then((list) => {
      list.forEach((item) => {
        cy.get(".select2-selection__placeholder").click();
        cy.wait(1000);
        cy.get(".select2-search__field").type(item.client_id).type("{enter}");
        cy.get("#username").type(item.username);
        cy.get("#password").type(item.password);
        cy.get(".btn").click();
        cy.wait(3000);
        // if (cy.get(".alert-message__text")) {
        //   cy.get("#oldPassword").type(item.password);
        //   cy.get("#newPassword").type("Helloworld@1");
        //   cy.get("#confirmPassword").type("Helloworld@1");
        //   cy.get(".btn").click();
        //   cy.get(".select2-selection__placeholder").click();
        //   cy.wait(1000);
        //   cy.get(".select2-search__field").type(item.client_id).type("{enter}");
        //   cy.get("#username").type(item.username);
        //   cy.get("#password").type(item.password);
        //   cy.get(".btn").click();
        //   cy.log("found");
        // }
        cy.get(":nth-child(8) > .nav-link > span").click();
        const share_id = item.share_id;
        cy.get(
          `:nth-child(${share_id}) > .row > .col-md-5 > .action-buttons > :nth-child(4) > .btn-issue`
        ).click();
        cy.wait(3000);
        cy.get("#selectBank").select(parseInt(item.bank_id));
        cy.get("#appliedKitta").type(item.kitta);
        cy.get("#crnNumber").type(item.crn_number);
        cy.get("#disclaimer").check();
        cy.get(".card-footer > .btn-primary > span").click();
        cy.get("#transactionPIN").type(item.transaction_pin);
        cy.get(".confirm-page-btn > .btn-primary").click();
        cy.get(
          ".header-menu__item--logout-desktop-view > .nav-link > .msi"
        ).click();
      });
    });
  });
});
