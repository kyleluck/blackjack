
function createDeck () {
  var fullDeck = [];
  var cards2toAce = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  var suits = ['diamonds', 'spades', 'hearts', 'clubs'];
  $.each(suits, function( indexSuits, valueSuits ) {
    $.each(cards2toAce, function( indexCards, valueCards ) {
      fullDeck.push({suit: suits[indexSuits], point: cards2toAce[indexCards]});
    });
  });
  return fullDeck;
}

function shuffleDeck (deck) {
  var shuffledDeck = createDeck();
  var i = 0;


}
//deck & hand are arrays of objects ^
//**function to generate deck
//function to shuffle cards
//function count points in hand
//function to compare dealer hand vs player hand
//function to deal: array.pop to deal
//function to clear table (on deal)
//remember ace is 1 or 11
//player blackjack automatically wins
