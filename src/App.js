import { useEffect, useRef, useState } from 'react';
import './App.css';
import { getQuickSortAnimations } from './Algorithms/QuickSort';
import { getInsertionSortAnimations } from './Algorithms/InsertionSort';
import { getMergeSortAnimations } from './Algorithms/MergeSort';

function App() {
  const [arr, setArr] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [arrLength,setArrLength] = useState(50);
  const [delay,setdelay] = useState(10);
  const [barHeight,setBarHeight] = useState(window.innerHeight/2);
  const containerRef = useRef(null);
  
  const ACCESSED_COLOUR = '#DB1F48';
  const SORTED_COLOUR = '#DB1F48';
  
  useEffect(initialiseArray, []);

  function initialiseArray() {
    if (isSorting) return;
    if (isSorted) resetArrayColour();
    setIsSorted(false);
    const arr = [];
    for (let i = 0; i < arrLength; i++) {
      arr.push(i+10);
    }
    shuffle(arr);
    setArr(arr);
  }

  function mergeSort() {
    const animations = getMergeSortAnimations(arr);
    animateArrayUpdate(animations);
  }

  function insertionSort() {
    const animations = getInsertionSortAnimations(arr);
    animateArrayUpdate(animations);
  }

  function quickSort() {
    const animations = getQuickSortAnimations(arr);
    animateArrayUpdate(animations);
  }

  function animateArrayUpdate(animations) {
    if (isSorting) return;
    setIsSorting(true);
    animations.forEach(([comparison, swapped], index) => {
      setTimeout(() => {
        if (!swapped) {
          if (comparison.length === 2) {
            const [i, j] = comparison;
            animateArrayAccess(i);
            animateArrayAccess(j);
          } else {
            const [i] = comparison;
            animateArrayAccess(i);
          }
        } else {
          setArr((prevArr) => {
            const [k, newValue] = comparison;
            const newArr = [...prevArr];
            newArr[k] = newValue;
            return newArr;
          });
        }
      }, index * delay);
    });
    setTimeout(() => {
      animateSortedArray();
    }, animations.length * delay);
  }

  function animateArrayAccess(index) {
    const arrayBars = containerRef.current.children;
    const arrayBarStyle = arrayBars[index].style;
    setTimeout(() => {
      arrayBarStyle.backgroundColor = ACCESSED_COLOUR;
    }, delay);
    setTimeout(() => {
      arrayBarStyle.backgroundColor = '';
    }, delay * 2);
  }

  function animateSortedArray() {
    const arrayBars = containerRef.current.children;
    for (let i = 0; i < arrayBars.length; i++) {
      const arrayBarStyle = arrayBars[i].style;
      setTimeout(
        () => (arrayBarStyle.backgroundColor = SORTED_COLOUR),
        i * delay,
      );
    }
    setTimeout(() => {
      setIsSorted(true);
      setIsSorting(false);
    }, arrayBars.length * delay);
  }

  function resetArrayColour() {
    const arrayBars = containerRef.current.children;
    for (let i = 0; i < arr.length; i++) {
      const arrayBarStyle = arrayBars[i].style;
      arrayBarStyle.backgroundColor = '';
    }
  }

  const shuffle = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[randomIndex];
      arr[randomIndex] = temp;
    }
  };

  return (
    <div className="App">
      <div className="ArrayContainer" ref={containerRef}>
        {arr.map((el, idx) => <div className="bar" style={{ height: (el / Math.max(...arr) * barHeight) }} key={idx}></div>)}
      </div>
      <div className="Controls">
        <div className="sliders">
          <div className="slider">
            <input className="range" value={arrLength} type="range" min="5" max={window.innerWidth / 4} onChange={(e)=>{setArrLength(e.target.value)}}></input>
            <p className="displayParameters">Array Length - {arrLength}</p>
          </div>
          <div className="slider">
            <input className="range" value={barHeight} type="range" min="10" max={window.innerHeight - 100} onChange={(e)=>{setBarHeight(e.target.value)}}></input>
            <p className="displayParameters"> Bar Height - {barHeight}px</p>
          </div>
          <div className="slider">
            <input className="range" value={delay} type="range" min="1" max="120" onChange={(e)=>{setdelay(e.target.value)}}></input>
            <p className="displayParameters">Delay - {delay}ms</p>
          </div>
        </div>
        <div className="buttons">
          <input className={`Btn ${isSorted ? "newArr" : ""}`} type="button" value="New Array" onClick={initialiseArray}></input>
          <input className="Btn" type="button" value="Quick sort" onClick={quickSort}></input>
          <input className="Btn" type="button" value="Insertion Sort" onClick={insertionSort}></input>
          <input className="Btn" type="button" value="Merge Sort" onClick={mergeSort}></input>
        </div>
      </div>
    </div>
  );
}

export default App;
