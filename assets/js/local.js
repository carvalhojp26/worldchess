import { Chess } from '../public/chess.js/dist/esm/chess.js'; 

var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')    

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.isGameOver()) return false
    
    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

function onDrop (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })
    
    // illegal move
    if (move === null) return 'snapback'
    
    updateStatus()
}
    
// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}

function updateStatus () {
    var status = ''
    
    var moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }
    
    // checkmate?
    if (game.isCheckmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }
    
    // draw?
    else if (game.isDraw()) {
        status = 'Game over, drawn position'
    }
    
    // game still on
    else {
        status = moveColor + ' to move'
        
        // check?
        if (game.isCheck()) {
            status += ', ' + moveColor + ' is in check'
        }
    }
    
    $status.html(status)
    $fen.html(game.fen())
    $pgn.html(game.pgn())
}

updateStatus()  


var config = {
    position: 'start',
    pieceTheme: '../public/chessboardjs-1.0.0/img/chesspieces/wikipedia/{piece}.png',
    draggable: true,
    dropOffBoard: 'snapback',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

document.addEventListener('DOMContentLoaded', function() {
    board = Chessboard('gameBoard', config);
});
