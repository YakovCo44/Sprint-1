'use strict'

var gBoard
var livesCounter = 3
var firstclick = true
var amountOfFlags = 0
var gLevel = {
    SIZE: 4,
    MINES: 2,
}
var gGame = {
    isOn: false,
    showCount: 0,
    markedCount: 0,
    secsPassed: 0,
    livesLeft: 3,
}

function onInit() {
    var firstclick = true
    livesCounter = 3
    gBoard = buildBoard()
    addMines(gBoard)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    const elLivesCounter = document.querySelector('.lives')
    elLivesCounter.querySelector('span').innerText = 3
}

function addMines(board) {
    if (gLevel.SIZE === 4) {
        board[getRandomIntInclusive(0, 3)][getRandomIntInclusive(0, 3)].isMine = true
        board[getRandomIntInclusive(0, 3)][getRandomIntInclusive(0, 3)].isMine = true
    }
    if (gLevel.SIZE === 8) {
        for (var i = 0; i < gLevel.MINES; i++) {
            board[getRandomIntInclusive(0, 7)][getRandomIntInclusive(0, 7)].isMine = true
        }
    }
    if (gLevel.SIZE === 12) {
        for (var i = 0; i < gLevel.MINES; i++) {
            board[getRandomIntInclusive(0, 11)][getRandomIntInclusive(0, 11)].isMine = true
        }
    }
    return board
}

function easyClick() {
    gLevel = {
        SIZE: 4,
        MINES: 2
    }
    onInit()
}

function intermediateClick() {
    gLevel = {
        SIZE: 8,
        MINES: 14
    }
    onInit()
}

function expertClick() {
    gLevel = {
        SIZE: 12,
        MINES: 32
    }
    onInit()
}

function buildBoard() {
    const board = []
    const rowsCount = gLevel.SIZE
    for (var i = 0; i < rowsCount; i++) {
        board[i] = []
        for (var j = 0; j < rowsCount; j++) {
            board[i][j] = {
                isShown: false,
                isMine: false,
                isMarked: false,
                minesAroundMe: 0,
            }
        }
    }
    return board
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundMe = countCloseMines(board, i, j)
        }
    }
}

function countCloseMines(board, rowIdx, colIdx) {
    var mineCounter = 0

    for (var i = (rowIdx - 1); i <= rowIdx + 1; i++) {
        for (var j = (colIdx - 1); j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (i >= 0 && i < board.length && j >= 0 && j < board[i].length) {
                if (board[i][j].isMine) mineCounter++
            }
        }
    }
    return mineCounter
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            let cellClass = ''
            if (board[i][j].isShown) {
                if (board[i][j].isMine) {
                    cellClass = 'mine'
                } else if (board[i][j].minesAroundMe === 0) {
                    cellClass = 'zero-mines'
                }
            }
            strHTML += `<td class="${cellClass}" onclick="onCellClicked(this, ${i}, ${j}, event)">`

            if (board[i][j].isShown) {
                if (board[i][j].isMine) {
                    strHTML += '<img src="img/mine.png" alt="Mine" style="width: 100%; height: auto;">'
                } else if (board[i][j].minesAroundMe > 0) {
                    strHTML += board[i][j].minesAroundMe;
                }
            }
            if (board[i][j].isMarked) {
                strHTML += '<img src="img/flag.png" alt="Flag" style="width: 100%; height: auto;">'
            }
            strHTML += '</td>'
        }
        strHTML += '</tr>'
    }
    document.querySelector('.board').innerHTML = strHTML
    document.querySelectorAll('.board td').forEach((cell, i) => {
        cell.addEventListener('contextmenu', function (e) {
            e.preventDefault()
            console.log(`Right cell clicked: ${Math.floor(i / board.length)}, ${i % board.length}`)
            onCellClicked(cell, Math.floor(i / board.length), i % board.length, e)
        })
    })
}

function onCellClicked(elCell, i, j, e) {
    e.preventDefault()
    if (e.button === 0) {
        console.log(`Cell clicked: ${i}, ${j}`)
        if (firstclick) {
            while (gBoard[i][j].isMine) {
                repoMine(gBoard, i, j)
            }
            firstclick = false
        }
        gBoard[i][j].isShown = true
        if (gBoard[i][j].isMine) {
            livesCounter--
            console.log('BOOM! You have', livesCounter, 'lives left')
            if (livesCounter < 1) gameOver()
            const elLivesCounter = document.querySelector('.lives')
            elLivesCounter.querySelector('span').innerText = livesCounter
        }
    }

    else if (e.button === 2) {
        console.log(`Right cell clicked: ${i}, ${j}`)
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
        elCell.classList.toggle('marked', gBoard[i][j].isMarked)
        elCell.innerHTML = '<img src="img/flag.png" alt="Flag" style="width: 100%; height: auto;">'
        if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
            amountOfFlags++
            console.log('amount of correct flags:', amountOfFlags)
        }
        checkGameOver()
    }

    renderBoard(gBoard)
}


function repoMine(board, i, j) {
    board[i][j].isMine = false
    board[getRandomIntInclusive(0, gLevel.SIZE - 1)][getRandomIntInclusive(0, gLevel.SIZE - 1)].isMine = true
    setMinesNegsCount(gBoard)
}

function checkGameOver() {
    if (amountOfFlags === gLevel.MINES) {
    console.log('You have won the game!')
    const winImg = document.querySelector('img')
    const defImg = winImg.src
    const textDef = document.querySelector('.lives')
    const defHTML = textDef.innerHTML
    textDef.innerHTML = 'You have won the game!!!'
    winImg.src = 'img/winning!.png'
    setTimeout(() => {
        textDef.innerHTML = defHTML
        winImg.src = defImg
    }, 5000)
    setTimeout(onInit, 5000)
    }
}

function gameOver() {
    const loseImg = document.querySelector('img')
    const defImg = loseImg.src
    const textDef = document.querySelector('.lives')
    const defHTML = textDef.innerHTML
    textDef.innerHTML = 'You have lost the game, please try again.'
    loseImg.src = 'img/blown.png'
    setTimeout(() => {
        textDef.innerHTML = defHTML
        loseImg.src = defImg
    }, 5000)
    setTimeout(onInit, 5000)
}

function expandShown(board, elCell, i, j) {

}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}  