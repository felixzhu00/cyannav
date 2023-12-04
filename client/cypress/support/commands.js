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

Cypress.Commands.add('signInUser', (email, password) => {
    cy.session([email, password], () => {
        cy.visit('localhost:3000')
        cy.get('#email').type(email)
        cy.get('#password').type(password)
        cy.get("#signInBtn").click()
        cy.url().should('contain', '/browsepage')
    })
    cy.visit('localhost:3000/browsepage')
});

Cypress.Commands.add('registerUser', (email, username, password, passwordVerify) => {
    cy.visit("localhost:3000")
    cy.get("#registerLink").click()
    cy.get('#email').type(email)
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('#verify-password').type(passwordVerify)
    cy.get("#registerBtn").click()
});