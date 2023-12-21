describe('profile page specs', () => {

    before(() => {
        cy.registerUser("autotest55", "autotest55", "12345678&&", "12345678&&")
        cy.wait(2000)
        cy.logoutUser()
      });
      
    beforeEach(() => {
        cy.signInUser("autotest55", "12345678&&")
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
    })

    it('should have /profile in the url', () => {
        cy.url().should('include', '/profile')
    })

    it('displays the change email modal when corresponding button is clicked', () => {
        cy.get("#emailEditBtn").click()
        cy.get('#change-email-modal-title').first().should('have.text', "Change Email")})

    it('displays the change email modal when corresponding button is clicked', () => {
        cy.get("#changeProfilePictureBtn").click()
        cy.get('#changePictureText').should('have.text', "Change Profile Picture")})
  
    it('displays the change password modal when corresponding button is clicked', () => {
        cy.get("#passwordEditBtn").click()
        cy.get('#change-email-password-title').first().should('have.text', "Change Password")})
  
    it('displays the change username modal when corresponding button is clicked', () => {
        cy.get("#usernameEditBtn").click()
        cy.get('#change-username-modal-title').first().should('have.text', "Change Username")})
  
    it('displays the delete account modal when corresponding button is clicked', () => {
        cy.get("#deleteAccountBtn").click()
        cy.get('#delete-account-modal-title').first().should('have.text', "Delete Your Account")})
  })