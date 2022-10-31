import React, { useState } from "react";

import { BsDot } from "react-icons/bs";
import { ImCross } from "react-icons/im";

const letterArr = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j" ];
const numberArr = [ 1, 2, 3, 4, 5, 6, 7, 8 , 9, 10 ];

// 0 - not checked
// 1 - clear
// 2 - hit
// 3 - destroy

export default function Area({
    playerId, clientField, setClientField,
    logicField, shipsData, playerTurn,
    setPlayerTurn, winner, setWinner,
    setRestart
}) {
    const cellStates = [
        undefined,
        <BsDot style={{ color: "black" }} />,
        <ImCross style={{ color: "black", transform: "scale(0.7)" }} />,
        <ImCross style={{ color: "red", transform: "scale(0.7)" }} />
    ];

    function checkCellExistance(x, y) {
        if (x < 0 || 9 < x) return false;
        if (y < 0 || 9 < y) return false;

        return true;
    }

    const onClickHandler = (x, y) => {
        if (clientField[y][x] !== 0) return;

        const cellId = logicField[y][x];
        const newClientField = [...clientField];
        if (cellId === 0) {
            newClientField[y][x] = 1;

            setClientField(newClientField);
            setPlayerTurn(playerId);

            return;
        }

        const target = shipsData.find(ship => ship.id === cellId);
        if (++target.destroyed === target.size) {
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    if (logicField[y][x] === cellId) {
                        newClientField[y][x] = 3;

                        for (let i = y - 1; i <= y + 1; i++){
                            for (let j = x - 1; j <= x + 1; j++ ) {
                                if (checkCellExistance(i, j) && newClientField[i][j] === 0)
                                    newClientField[i][j] = 1;
                            }
                        }
                    }
                }
            }

            setClientField(newClientField);

            if (shipsData.every(ship => ship.destroyed === ship.size)) {
                setWinner((playerId % 2) + 1);
                console.log("You are the winner");
            }
        } else {
            newClientField[y][x] = 2;

            setClientField(newClientField);
        }
    }

    return (
        <div className={ `area ${playerTurn === playerId ? "enemy-turn" : ""}` }>
            <div className="title">{ `Player ${playerId}` }</div>

            <div></div>

            <div className="vert-numeration">
                { letterArr.map(elem => <div key={ elem } className="value">{ elem }</div>) }
            </div>

            <div></div>

            <div className="side-numeration">
                { numberArr.map(elem => <div key={ elem } className="value">{ elem }</div>) }
            </div>

            <div className="field">
                { clientField.map((row, rowIndex) => {
                    return (
                        <React.Fragment key={ rowIndex }>
                            { row.map((cell, cellIndex) => {
                                return (
                                    <div
                                        key={ `${rowIndex}_${cellIndex}` }
                                        className="square"
                                        onClick={ () => onClickHandler(cellIndex, rowIndex) }
                                    >
                                        { cellStates[cell] }
                                    </div>
                                );
                            }) }
                        </React.Fragment>
                    );
                }) }
            </div>

            <div className="side-numeration">
                { numberArr.map(elem => <div key={ elem } className="value">{ elem }</div>) }
            </div>

            <div></div>

            <div className="vert-numeration">
                { letterArr.map(elem => <div key={ elem } className="value">{ elem }</div>) }
            </div>

            <div></div>

            <div className={ `result-wd ${ winner !== null ? "active" : "" }` }>
                <h2>
                    { winner === playerId
                    ?   "winner"
                    :   "loser"
                    }
                </h2>

                <div
                    className="restart-btn"
                    onClick={ () => setRestart({}) }
                >
                    play again
                </div>
            </div>
        </div>
    );
}