import { useState, useEffect } from "react";

import "./App.css";

import FieldCreator from "./components/fieldcreator/FieldCreator";
import GameStarter from "./components/gamestarter/GameStarter";

export default function App() {
    const [ restart, setRestart ] = useState({});

    const [ player1Field, setPlayer1Field ] = useState(null);
    const [ player2Field, setPlayer2Field ] = useState(null);

    useEffect(() => {
        setPlayer1Field(null);
        setPlayer2Field(null);
    }, [restart]);

    return (
        <div className="App">
            { player1Field === null
            ?   <FieldCreator
                    key={ "player1" }
                    playerId={ 1 }
                    setPlayerState={ setPlayer1Field }
                />
            :   player2Field === null
                ?   <FieldCreator
                        key={ "player2" }
                        playerId={ 2 }
                        setPlayerState={ setPlayer2Field }
                    />
                :   <GameStarter
                        player1={ player1Field }
                        player2={ player2Field }
                        setRestart={ setRestart }
                    />
            }
        </div>
    );
};