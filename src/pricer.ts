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

// Opaque type - Branded types
declare const priceTag: unique symbol
type Price = number & { readonly [priceTag]: "" }
export const euros = (raw: number): Price => raw as Price

declare const percentTag: unique symbol
type Percent = number & { readonly [percentTag]: "" }
export const percent = (raw: number): Percent => raw as Percent

type BasketLine = {
  quantity: number
  unitPrice: Price
  tax: Percent
}

const applyTax = (beforeTax: Price, tax: Percent) =>
  euros(beforeTax * (1 + tax / 100))

const applyDiscount = (price: Price, discount: Percent): Price =>
  euros(price * (1 - discount / 100))

const applyDiscounts = (price: Price): Price => {
  if (price >= 5000) return applyDiscount(price, percent(5))
  if (price >= 1000) return applyDiscount(price, percent(3))
  return price
}

export const format = (price: Price): string => price.toFixed(2) + " €"

export const getPrice = (line: BasketLine): string => {
  const beforeTax = euros(line.quantity * line.unitPrice)
  const afterTax = applyTax(beforeTax, line.tax)
  const afterDiscount = applyDiscounts(afterTax)
  return format(afterDiscount)
}
