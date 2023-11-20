describe('profile page specs', () => {
  beforeEach(() => {
    cy.visit('129.213.145.105')
    cy.get("#signInBtn").click()
    cy.get("#settingsDropdown").click()
    cy.get("#settingsDropdownOption").first().click()
  })
  it('displays the change email modal when corresponding button is clicked', () => {
    cy.get("#emailEditBtn").click()
    cy.get('#change-email-modal-title').first().should('have.text', "Change Email")})

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
