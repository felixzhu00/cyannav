describe("register page specs", () => {
    beforeEach(() => {
        cy.visit("localhost:3000")
        cy.get("#registerLink").click()
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
