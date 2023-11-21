describe("profile page specs", () => {

    Cypress.Commands.add('register', (email, username, password, verifyPassword) => {
        cy.session([email, username, password, verifyPassword], () => {
          cy.visit("localhost:3000")
          cy.get("#registerLink").click()
          cy.get('#email').type(email)
          cy.get('#username').type(username)
          cy.get('#password').type(password)
          cy.get('#verify-password').type(verifyPassword)
          cy.get("#registerBtn").click()
        })
    })
    Cypress.Commands.add('login', (email, password) => {
        cy.session([email, password], () => {
          cy.visit("localhost:3000")
          cy.get('#email').type(email)
          cy.get('#password').type(password)
          cy.get("#signInBtn").click()
        })
    })
    beforeEach(() => {
        cy.register("autotest", "autotest", "11223344!!", "11223344!!")
        cy.get("#signInBtn").click()
        cy.login("autotest", "11223344!!")
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
    })
    it("displays the change email modal when corresponding button is clicked", () => {
        cy.get("#emailEditBtn").click()
        cy.get("#change-email-modal-title")
            .first()
            .should("have.text", "Change Email")
    })

    it("displays the change password modal when corresponding button is clicked", () => {
        cy.get("#passwordEditBtn").click()
        cy.get("#change-email-password-title")
            .first()
            .should("have.text", "Change Password")
    })

    it("displays the change username modal when corresponding button is clicked", () => {
        cy.get("#usernameEditBtn").click()
        cy.get("#change-username-modal-title")
            .first()
            .should("have.text", "Change Username")
    })

    it("displays the delete account modal when corresponding button is clicked", () => {
        cy.get("#deleteAccountBtn").click()
        cy.get("#delete-account-modal-title")
            .first()
            .should("have.text", "Delete Your Account")
    })
})
