import {useState} from "react";

function Graph(props: {}): JSX.Element {
    const [width, setWidth] = useState(document.body.clientWidth);
    window.addEventListener('resize', () => {
        setWidth(document.body.clientWidth);
    });
    const space = 10;
    const empty = 2;
    const CanInOneRow = (blk: number): boolean => {
        return width - empty >= 600 * blk + space * (blk + 1);
    };
    let block = 1;
    if (CanInOneRow(3)) {
        block = 3;
    } else if (CanInOneRow(2)) {
        block = 2;
    }
    const height = 200;
    const perWidth = (width - empty - space * (block + 1)) / block;
    const SpaceElement = () => {
        return <div style={{width: space, height: 1, float: 'left'}}/>;
    };
    const baseBlockStyle = {
        width: perWidth,
        height: height,
        backgroundColor: "#EEE",
        float: 'left',
    };
    return (
        <div style={{
            display: 'inline-block',
        }}>
            <SpaceElement/>
            {
                (() => {
                    const r = [];
                    for (let i = 0; i < block; i += 1) {
                        r.push(
                            <div key={2 * i} style={Object.assign(baseBlockStyle)}/>
                        );
                        r.push(
                            <SpaceElement key={2 * i + 1}/>
                        );
                    }
                    return r;
                })()
            }
        </div>
    );
}

export default function Compare(props: {}): JSX.Element {
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;
    console.log(height);
    console.log(width);
    return (
        <>
            <Graph/>
            <Graph/>
        </>
    );
    // return (
    //     <>
    //         <div style={{
    //             float: 'left',
    //             height: height,
    //             width: width,
    //             backgroundColor: '#000'
    //         }}/>
    //         <div style={{
    //             float: 'left',
    //             height: height,
    //             width: width,
    //             backgroundColor: '#BBB'
    //         }}/>
    //         <div style={{
    //             float: 'left',
    //             height: height,
    //             width: width,
    //             backgroundColor: '#DDD'
    //         }}/>
    //     </>
    // )
}