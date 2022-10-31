import React, { useState } from "react";

import "./FieldCreator.css";

const letterArr = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j" ];
const numberArr = [ 1, 2, 3, 4, 5, 6, 7, 8 , 9, 10 ];

// 0 - empty
// >=1 - part of real ship
// -1 - part of imaginary ship

export default function FieledCreator({ playerId, setPlayerState }) {
    const [ field, setField ] = useState(new Array(10).fill().map(() => new Array(10).fill(0)));
    const [ shipsData, setShipsData ] = useState([]);

    const [ selectedShip, setSelectedShip ] = useState({
        size: null,
        isVert: false
    });

    const [ shipsList, setShipsList ] = useState([
        { size: 4, count: 1 },
        { size: 3, count: 2 },
        { size: 2, count: 3 },
        { size: 1, count: 4 }
    ]);

    const [ isVert, setIsVert ] = useState(false);
    const [ idCounter, setIdCounter ] = useState(1);



    function ShipPreview({ size, className = "" }) {
        const arrSize = new Array(size).fill();
    
        return (
            <div className={ "ship " + className }>
                { arrSize.map((elem, index) => <div key={ index } className="block"></div>) }
            </div>
        );
    }



    const selectShip = (ship) => {
        if (ship.size !== selectedShip.size)
            setSelectedShip({ size: ship.size, isVert: isVert });
        else
            setSelectedShip({ size: null, isVert: isVert });
    }

    const onEnterHandler = (x, y) => {
        const shipSize = selectedShip.size;

        if (shipSize === null) return;

        const shipPosition = { x1: x, y1: y };
        if (!isVert) {
            shipPosition.x2 = shipPosition.x1 + shipSize - 1;
            shipPosition.y2 = shipPosition.y1;
        } else {
            shipPosition.x2 = shipPosition.x1;
            shipPosition.y2 = shipPosition.y1 + shipSize - 1;
        }

        if (shipPosition.x2 > 9 || shipPosition.y2 > 9) return;
        for (let y = shipPosition.y1 - 1; y <= shipPosition.y2 + 1; y++) {
            for (let x = shipPosition.x1 - 1; x <= shipPosition.x2 + 1; x++) {
                if (field[y] !== undefined && field[y][x] !== undefined && field[y][x] >= 1)
                    return;
            }
        }

        const newField = field.map(row => row.map(cell => cell === -1 ? 0 : cell));
        for (let y = shipPosition.y1; y <= shipPosition.y2; y++ ) {
            for (let x = shipPosition.x1; x <= shipPosition.x2; x++) {
                newField[y][x] = -1;
            }
        }

        setField(newField);
    }

    const onLeaveHandler = () => {
        if (selectedShip.size === null) return;

        const newField = field.map(row => row.map(cell => cell === -1 ? 0 : cell));
        setField(newField);
    }

    const placeShipHandler = (x, y) => {
        const shipSize = selectedShip.size;

        if (shipSize === null) {
            const shipId = field[y][x];
            if (shipId >= 1) {
                const removedSize = shipsData.find(ship => ship.id === shipId).size;
                const newShipsList = shipsList.map(ship => {
                    if (ship.size === removedSize) ship.count++;
                    return ship;
                });

                setShipsList(newShipsList);
                setShipsData(shipsData.filter(ship => ship.id !== shipId));

                const newField = field.map(row => row.map(cell => cell === shipId ? 0 : cell));
                setField(newField);
            }

            return;
        }

        const shipPosition = { x1: x, y1: y };
        if (!isVert) {
            shipPosition.x2 = shipPosition.x1 + shipSize - 1;
            shipPosition.y2 = shipPosition.y1;
        } else {
            shipPosition.x2 = shipPosition.x1;
            shipPosition.y2 = shipPosition.y1 + shipSize - 1;
        }

        if (shipPosition.x2 > 9 || shipPosition.y2 > 9) return;
        for (let y = shipPosition.y1 - 1; y <= shipPosition.y2 + 1; y++) {
            for (let x = shipPosition.x1 - 1; x <= shipPosition.x2 + 1; x++) {
                if (field[y] !== undefined && field[y][x] !== undefined && field[y][x] >= 1)
                    return;
            }
        }

        const newField = field.map(row => row.map(cell => cell === -1 ? 0 : cell));
        for (let y = shipPosition.y1; y <= shipPosition.y2; y++ ) {
            for (let x = shipPosition.x1; x <= shipPosition.x2; x++) {
                newField[y][x] = idCounter;
            }
        }

        setShipsData([...shipsData, {
            id: idCounter,
            size: shipSize,
            destroyed: 0
        }]);
        setIdCounter(idCounter + 1);
        setField(newField);

        const newShipsList = [...shipsList];
        const currentShip = newShipsList.find(elem => elem.size === shipSize);
        currentShip.count -= 1;

        setShipsList(newShipsList);
        setSelectedShip({...selectedShip, size: null});

    }

    return (
        <div className="field-creator">
            <div className="options">
                <h2 className="title">{ `Player ${playerId} ship placement` }</h2>

                <div className="b-ships">
                    { shipsList.map((ship) => {
                        return (
                            <div
                                key={ ship.size }
                                className={ ship.count === 0
                                ? "item disabled"
                                : "item"
                                }
                                onClick={ () => selectShip(ship) }
                            >
                                <div
                                    className={ selectedShip.size === ship.size
                                    ? "b-preview selected"
                                    : "b-preview"
                                    }
                                >
                                    <ShipPreview size={ ship.size } />
                                </div>

                                <div className="b-count">{ ship.count }</div>
                            </div>
                        );
                    }) }
                </div>

                <div className="b-rotate">
                    <div className="b-preview">
                        { selectedShip.size !== null
                        ? <ShipPreview
                            className={ isVert ? "rotate" : "" }
                            size={ selectedShip.size }
                          />
                        : undefined
                        }
                    </div>

                    <div
                        className="b-btn"
                        onClick={ () => {
                            setSelectedShip({...selectedShip, isVert: !isVert});
                            setIsVert(!isVert);
                        } }
                    >
                        rotate
                    </div>
                </div>

                <div
                    className={ shipsList.some(elem => elem.count !== 0)
                    ? "b-submit disabled"
                    : "b-submit"
                    }
                    onClick={ () => setPlayerState({ field, shipsData }) }
                >
                    submit
                </div>
            </div>

            <div className="field-wraper">
                <div></div>

                <div className="top-numeration">
                    { letterArr.map(elem => <div key={ elem } className="value">{ elem }</div>) }
                </div>

                <div className="left-numeration">
                    { numberArr.map(elem => <div key={ elem } className="value">{ elem }</div>) }
                </div>

                <div className="field">
                    { field.map((row, rowIndex) => {
                        return (
                            <React.Fragment key={ rowIndex }>
                                { row.map((cell, cellIndex) => {
                                    return (
                                        <div
                                            key={ `${rowIndex}_${cellIndex}` }
                                            className={ `square ${ cell >= 1 ? "red" : cell === -1 ? "mouse-over" : "" }` }
                                            onMouseEnter={ () => onEnterHandler(cellIndex, rowIndex) }
                                            onMouseLeave={ () => onLeaveHandler() }
                                            onClick={ () => placeShipHandler(cellIndex, rowIndex) }
                                        ></div>
                                    );
                                }) }
                            </React.Fragment>
                        );
                    }) }
                </div>
            </div>
        </div>
    );
}