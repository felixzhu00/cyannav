describe('register page specs', () => {
    beforeEach(() => {
      cy.visit('129.213.145.105')
      cy.get("#registerLink").click()
    })
  
    it('checks that email is displayed', () => {
        cy.get('label[for="email"]')
        .should('have.text', 'Email Address *');
    })
    it('checks that password is displayed', () => {
        cy.get('label[for="password"]')
        .should('have.text', 'Password*');
    })
    it('checks that username is displayed', () => {
        cy.get('label[for="username"]')
        .should('have.text', "Username (visible to public)");
    })
  })