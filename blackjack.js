
function createDeck () {
  var fullDeck = [];
  var cards2toAce = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  var suits = ['diamonds', 'spades', 'hearts', 'clubs'];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < cards2toAce.length; j++) {
      fullDeck.push({suit: suits[i], point: cards2toAce[j]});
    }
  }
  return fullDeck;
}
//deck & hand are arrays of objects ^
//function to generate deck
//function to shuffle cards
//function count points in hand
//function to compare dealer hand vs player hand
//function to deal: array.pop to deal
//function to clear table (on deal)
//remember ace is 1 or 11
//player blackjack automatically wins
