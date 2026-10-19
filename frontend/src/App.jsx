import React, { useEffect, useState } from 'react'
import ohneImg from "./assets/ohnepixel.webp"
import caseImg from "./assets/case.png"
import goldImg from "./assets/gold.png"
import glovesImg from "./assets/gloves.webp"
import knifeImg from "./assets/knife.webp"
import blueGemImg from "./assets/bluegem.webp"

const App = () => {
  const [counter, setCounter] = useState(0)
  const [pts, setPts] = useState(0)

  const formatNumberLong = (num) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'long',
      maximumFractionDigits: 1
    }).format(num);
  };

  const shopMap = [
    {name: "Case", description: "each case is a +1 for click multiplier and +1 pts", img: caseImg, lvlMultiplier: 1, initialPrice: 100},
    {name: "GOLD", description: "each case is a +3 for click multiplier and +3 pts", img: goldImg, lvlMultiplier: 3, initialPrice: 1000},
    {name: "Gloves!", description: "each case is a +5 for click multiplier and +5 pts", img: glovesImg, lvlMultiplier: 5, initialPrice: 5000},
    {name: "Knife!", description: "each case is a +10 for click multiplier and +10 pts", img: knifeImg, lvlMultiplier: 10, initialPrice: 10000},
    {name: "Blue Gem!", description: "each case is a +20 for click multiplier and +20 pts", img: blueGemImg, lvlMultiplier: 20, initialPrice: 20000},
  ]

  if(!localStorage.getItem("userShopInfo")){
    localStorage.setItem("userShopInfo", JSON.stringify({
      "Case": {level: 0},
      "GOLD": {level: 0},
      "Gloves!": {level: 0},
      "Knife!": {level: 0},
      "Blue Gem!": {level: 0},
    }))
  }
  var userShopInfo = localStorage.getItem("userShopInfo") && JSON.parse(localStorage.getItem("userShopInfo"))


  function handleClick(){
    var multiplier = 1
    for (const item of shopMap) {
      multiplier += userShopInfo[item.name]?.level * item.lvlMultiplier
    }

    setCounter(prev => prev + (1 * multiplier))
    console.log(counter);
  }

  function handleShopClick(item){
    const price = item.initialPrice * (userShopInfo[item.name]?.level == 0 ? 1 : userShopInfo[item.name]?.level)
    if(counter >= price){
      setCounter(prev => prev - price)
      userShopInfo[item.name].level += 1
      localStorage.setItem("userShopInfo", JSON.stringify(userShopInfo))
    }else{
      console.log("Not enough money");
    }
  }

  function handlePts(){
    var multiplier = 0
    for (const item of shopMap) {
      multiplier += userShopInfo[item.name]?.level * item.lvlMultiplier
    }
    setCounter(prev => prev + (1 * multiplier))
    setPts(multiplier)
  }

  useEffect(() => {
    const interval = setInterval(() => {handlePts()}, 1000);
    return () => clearInterval(interval);
  }, [userShopInfo]);

  return (
    <div className='flex select-none'>
        <div className='text-2xl font-bold absolute'>
          <>Points per second: {formatNumberLong(pts)}</>
        </div>
      <div className='w-[70vw] flex items-center h-[100vh] flex-col justify-center'>
        <div>
          <p className='text-3xl font-bold'>Points: {formatNumberLong(counter)}</p>
          <img draggable={false} src={ohneImg} alt="ohne" className='cursor-pointer hover:scale-103 transition-all duration-75' onClick={handleClick}/>
        </div>
      </div>
      <div className='w-[30vw] flex flex-col justify-between'>
        <div className='flex bg-gray-600 p-4 gap-4 w-[100%] h-full flex-col relative'>
          {shopMap.map(item => (
            <div 
              key={item.name}
                className={`group flex items-center justify-between bg-gray-700 px-4 py-2 h-[10vh] rounded-xl duration-75 hover:bg-gray-800 ${item.initialPrice * (userShopInfo[item.name]?.level == 0 ? 1 : userShopInfo[item.name]?.level) > counter ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => handleShopClick(item)}
            >
              <img draggable={false} src={item.img} alt={item.name} className="w-20" />
              <p className='text-bold text-white opacity-[80%] text-2xl'>{formatNumberLong(userShopInfo[item.name]?.level || 0)}</p>
              <div className="flex flex-col absolute bg-gray-900 text-white text-xs font-medium p-3 rounded-md shadow-lg whitespace-nowrap pointer-events-none z-50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className='flex gap-3'>{item.name} <p className='text-gray-600'>Level: {formatNumberLong(userShopInfo[item.name]?.level || 0)}</p></div>
                <p>{item.description}</p>
                <p>Price: {formatNumberLong(item.initialPrice * (userShopInfo[item.name]?.level == 0 ? 1 : userShopInfo[item.name]?.level))}</p>
              </div>
            </div>
          ))}
        </div>
          <div className='h-[15vh]'>
            <p>upgrades</p>
          </div>
      </div>
    </div>
  )
}

export default App