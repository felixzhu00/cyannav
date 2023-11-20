describe('login page specs', () => {
    beforeEach(() => {
      cy.visit('129.213.145.105')
    })
  
    it('checks that email is displayed', () => {
        cy.get('label[for="email"]')
        .should('have.text', 'Email Address *');

    })
    it('checks that password is displayed', () => {
        cy.get('label[for="password"]')
        .should('have.text', 'Password *');
    })
  })