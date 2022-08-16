describe('empty spec', () => {
    it('passes', () => {
        cy.visit('http://localhost:5678/').pause();
        cy.get('input[ name="username"]').type('ram202514');
        cy.get('input[name="password"]').type('dhanu@2014');
        cy.get('input[name="repassword"]').type('dhanu@2014');
        cy.get('button[type="submit"]').click();
        cy.get('input[name="username"]').type('ram202514');
        cy.get('input[name="password"]').type('dhanu@2014');
        cy.get('button[type="submit"]').click();
        cy.get('button[type="submit"]').click();
    })
})