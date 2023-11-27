describe("register page specs", () => {

    beforeEach(() => {
        cy.visit("localhost:3000")
        cy.get("#registerLink").click()
    })

    it("ensures error message is displayed when bad info is entered", () => {
        cy.get("#email").type("hi")
        cy.get("#password").type("yes")
        cy.get("#username").type("hi")
        cy.get("#verify-password").type("yes")
        cy.get("#registerBtn").click()
        cy.get("#errMsg2").should("have.text", "Password fails security requirement.")
    })

    it('should have /register in the url', () => {
        cy.url().should('include', '/register')
    })

    it("checks that email is displayed", () => {
        cy.get('label[for="email"]').should("have.text", "Email Address")
    })
    it("checks that password is displayed", () => {
        cy.get('label[for="password"]').should("have.text", "Password")
    })
    it("checks that username is displayed", () => {
        cy.get('label[for="username"]').should(
            "have.text",
            "Username (visible to public)"
        )
    })
})
