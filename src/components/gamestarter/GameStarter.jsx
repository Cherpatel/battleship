import React, { useState } from "react";

import "./GameStarter.css";

import { BsArrowRightCircleFill } from "react-icons/bs";

import Area from "./Area";

export default function GameStarter({ player1, player2, setRestart }) {
    const [ clientField1, setClientField1 ] = useState(new Array(10).fill().map(() => new Array(10).fill(0)));
    const [ clientField2, setClientField2 ] = useState(new Array(10).fill().map(() => new Array(10).fill(0)));

    const [ playerTurn, setPlayerTurn ] = useState(1);
    const [ winner, setWinner ] = useState(null)

    return (
        <div className="game-wraper">
            <Area
                playerId={ 1 }
                clientField={ clientField1 }
                setClientField={ setClientField1 }
                logicField={ player1.field }
                shipsData={ player1.shipsData }
                playerTurn={ playerTurn }
                setPlayerTurn={ setPlayerTurn }
                winner={ winner }
                setWinner={ setWinner }
                setRestart={ setRestart }
            />

            <div className={ `turn-arrow ${playerTurn === 2 ? "rotate" : ""}` }>
                <BsArrowRightCircleFill />
            </div>

            <Area
                playerId={ 2 }
                clientField={ clientField2 }
                setClientField={ setClientField2 }
                logicField={ player2.field }
                shipsData={ player2.shipsData }
                playerTurn={ playerTurn }
                setPlayerTurn={ setPlayerTurn }
                winner={ winner }
                setWinner={ setWinner }
                setRestart={ setRestart }
            />
        </div>
    );
}