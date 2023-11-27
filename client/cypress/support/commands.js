// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// before(() => {
//     cy.registerUser("autotest2", "autotest2", "11223344##", "11223344##")
//     cy.wait(2000)
//     cy.get("#settingsDropdown").click()
//     cy.get("#settingsDropdownOption").first().click()
//     cy.get("#logoutBtn").click()
//     cy.url().should('include', '/login')
//   });

Cypress.Commands.add('signInUser', (email, password) => {
    cy.visit("129.213.145.105")
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get("#signInBtn").click()
});

Cypress.Commands.add('registerUser', (email, username, password, passwordVerify) => {
    cy.visit("129.213.145.105")
    cy.get("#registerLink").click()
    cy.get('#email').type(email)
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('#verify-password').type(passwordVerify)
    cy.get("#registerBtn").click()
});