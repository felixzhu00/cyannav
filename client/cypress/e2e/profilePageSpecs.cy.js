describe("profile page specs", () => {

    beforeEach(() => {
        cy.visit("localhost:3000")
        cy.get("#registerLink").click()
        cy.get('#email').type("autotest")
        cy.get('#username').type("autotest")
        cy.get('#password').type("11223344!!")
        cy.get('#verify-password').type("11223344!!")
        cy.get("#registerBtn").click()
        cy.get('#email').type("autotest")
        cy.get('#password').type("11223344!!")
        cy.get("#signInBtn").click()
        cy.wait(500)
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").click()
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
