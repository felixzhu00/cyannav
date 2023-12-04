describe("map viewing specs", () => {
    // before(() => {
    //     cy.signInUser("autotest55", "12345678&&")
    //     cy.get("#createMapOuterBtn").click()
    //     cy.get("#mapTitleBox").type("testing")
    //     cy.get("#geojsonOption").click()
    //     cy.get("#template-select").parent().click()
    //     cy.get("#heatmapOption").click()
    //     cy.fixture('testMap.json', null).as('testmap')
    //     cy.get("#dropzoneArea").click()
    //     cy.get("#dropzoneArea2")
    //     .selectFile("@testmap")
    //     cy.get("#createMapBtnFromMyMaps")
    //     .should("have.text", "Create")
    //     .click();
    //     cy.reload()
    // })

    // beforeEach(() => {
    //     cy.signInUser("autotest55", "12345678&&")
    //     cy.get("#mapImage").first().click()
    // })

    it("filler", ()=> {
        cy.visit("localhost:3000")
    })

    // it("export map button", () => {
    //     cy.contains("button", "Export").click()
    //     cy.get("#exportMapModalText").should(
    //         "have.text",
    //         "Select the format you would like to export as:"
    //     )
    //     cy.get("#exportBtnOnModal").should("have.text", "Export").click()
    // })
    // it('publish map button', () => {
    //     cy.contains('button', 'Publish')
    //     .click()
    //     cy.get("#publishBtnOnModal")
    //     .should("have.text", "PUBLISH")
    //     .click();
    // })
    // it("add field map button", () => {
    //     cy.get("#addFieldBtn").click()
    //     cy.get("#add-field-modal-title").should("have.text", "Add Field")
    // })
    // it("add comment button", () => {
    //     cy.get("#commentTab").should('exist')
    // })
    // it("ensure redo on screen", () => {
    //     cy.get("#redoBtn").click()
    // })
    // it("ensure undo on screen", () => {
    //     cy.get("#undoBtn").click()
    // })
    // it('ensure like btn works', () => {
    //     cy.get("#likeBtn")
    //     cy.get("#numLikes")
    //     .should("have.text", "0")
    // })
    // it("ensure dislike btn works", () => {
    //     cy.get("#dislikeBtn").click()
    //     cy.get("#numDislikes")
    //     .should("have.text", "0")
    // })
})
