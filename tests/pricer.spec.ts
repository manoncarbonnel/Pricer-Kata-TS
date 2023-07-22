import { euros, format, getPrice, percent } from "../src/pricer";

// Générer une chaine de caractères avec le prix total à partir des informations suivantes :
// Nombre d'articles
// Prix unitaire
// Taxe en % (voir exemple)
// Exemples chiffrées :

// 3 articles à 1,21 € et taxe 0 % → “3.63 €”
// 3 articles à 1,21 € et taxe 5 % → “3.81 €”
// 3 articles à 1,21 € et taxe 20 % → “4.36 €”
// Puis on ajoute des réductions si le prix total HT dépasse un seuil :

// 1000 € → Remise 3% :
// Ex : 5 x 345,00 € + taxe 10% → “1840.58 €”
// 5000 € → Remise 5% :
// Ex : 5 x 1299,00 € + taxe 10% → “6787.28 €”
// ⚠️ Pour les remises, il n'y a pas besoin d'ajouter de paramètres d'entrée puisque c'est basé sur le prix total HT !

describe('Pricer', () => {
    describe("The line price is the unit price times the quantity", () => {
        it.each([
            [1, euros(1), euros(1)],
            [1, euros(1.5), euros(1.5)],
            [2, euros(1), euros(2)],
            [2, euros(1.5), euros(3)],
        ])
            ("%s * %s € and tax 0% -> %s €", (quantity, unitPrice, expected) => {
                expect(getPrice({ quantity, unitPrice, tax: percent(0) })).toEqual(format(expected));
            })
    });

    describe('Taxes', () => {
        it.each([
            [1, euros(1), percent(10), euros(1.10)],
            [1, euros(1), percent(20), euros(1.20)],
            [2, euros(1), percent(10), euros(2.20)],
        ])
            ("%s * %s € and tax %s% -> %s €", (quantity, unitPrice, tax, expected) => {
                expect(getPrice({ quantity, unitPrice, tax: tax })).toEqual(format(expected));
            })
    });

    describe('Discounts', () => {
        describe('Discount 3% for price > 1000€', () => {
            it.each([
                [1, euros(1000), percent(0), 3, euros(970)],
                [2, euros(500), percent(0), 3, euros(970)],
                [3, euros(500), percent(0), 3, euros(1455)],
            ])
                ("%s * %s € and tax %s% a discount %s% -> %s €", (quantity, unitPrice, tax, discount, expected) => {
                    expect(getPrice({ quantity, unitPrice, tax: tax })).toEqual(format(expected));
                })
        });
        describe('Discount 5% for price > 5000€', () => {
            it.each([
                [1, euros(5000), percent(0), 5, euros(4750)],
            ])
                ("%s * %s € and tax %s% a discount %s% -> %s €", (quantity, unitPrice, tax, discount, expected) => {
                    expect(getPrice({ quantity, unitPrice, tax: tax })).toEqual(format(expected));
                })
        });
    });

    describe('Acceptance', () => {
        it.each([
            [5, euros(345), percent(10), euros(1840.58)],
            [5, euros(1299), percent(10), euros(6787.28)],
        ])
            ("%s * %s € and tax %s% -> %s €", (quantity, unitPrice, tax, expected) => {
                expect(getPrice({ quantity, unitPrice, tax: tax })).toEqual(format(expected));
            })
    })

});

