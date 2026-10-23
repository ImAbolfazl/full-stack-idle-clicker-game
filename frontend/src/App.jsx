import React, { useEffect, useRef, useState } from 'react'
import caseImg from "./assets/case.png"
import goldImg from "./assets/gold.png"
import glovesImg from "./assets/gloves.webp"
import knifeImg from "./assets/knife.webp"
import blueGemImg from "./assets/bluegem.webp"
import furyImg from "./assets/fury.png"
import ohneImg from "./assets/ohnepixel.webp"
import s1mpleImg from "./assets/s1mple.png"
import donkImg from "./assets/donk.webp"
import axios from "axios"
import { toast, ToastContainer } from 'react-toastify';

const App = () => {
  const [counter, setCounter] = useState(0)
  const [pts, setPts] = useState(0)
  const [clicks, setClicks] = useState([])
  const [userShopInfo, setShopInfo] = useState({
          "Case": {level: 0},
          "GOLD": {level: 0},
          "Gloves!": {level: 0},
          "Knife!": {level: 0},
          "Blue Gem!": {level: 0},
        })
  const [loading, setLoading] = useState(true)
  const [UUID, setUUID] = useState(localStorage.getItem("uuid"))
  const counterRef = useRef(counter);
  const shopInfoRef = useRef(userShopInfo);
  const uuidRef = useRef(UUID);

  useEffect(() => {
    counterRef.current = counter;
    shopInfoRef.current = userShopInfo;
    uuidRef.current = UUID;
  }, [counter, userShopInfo, UUID]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (uuidRef.current) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/game/update/${uuidRef.current}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            points: counterRef.current,
            shopInfo: JSON.stringify(shopInfoRef.current)
          }),
          keepalive: true
        });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const formatNumberLong = (num) => {
    const n = Number(num);
    if (isNaN(n) || n < 1000) return Math.floor(n || 0).toString();

    const suffixes = [
      "", "thousand", "million", "billion", "trillion", 
      "quadrillion", "quintillion", "sextillion", "septillion", 
      "octillion", "nonillion", "decillion", "undecillion", 
      "duodecillion", "tredecillion", "quattuordecillion", "quindecillion",
      "sexdecillion", "septendecillion", "octodecillion", "novemdecillion",
      "vigintillion", "unvigintillion", "duovigintillion", "trevigintillion",
      "quattuorvigintillion", "quinvigintillion", "sexvigintillion", "septenvigintillion",
      "octovigintillion", "novemvigintillion", "trigintillion"
    ];

    const tier = Math.floor(Math.log10(Math.abs(n)) / 3);

    if (tier >= suffixes.length) {
      return n.toExponential(1);
    }

    const scale = Math.pow(10, tier * 3);
    const scaled = n / scale;
    const formatted = scaled.toFixed(1).replace(/\.0$/, '');

    return `${formatted} ${suffixes[tier]}`;
  };

  const shopMap = [
    {name: "Case", description: "each Case is a +1 for click multiplier and +1 pts", img: caseImg, lvlMultiplier: 1, initialPrice: 100},
    {name: "GOLD", description: "each GOLD is a +3 for click multiplier and +3 pts", img: goldImg, lvlMultiplier: 3, initialPrice: 1000},
    {name: "Gloves!", description: "each Gloves! is a +5 for click multiplier and +5 pts", img: glovesImg, lvlMultiplier: 5, initialPrice: 5000},
    {name: "Knife!", description: "each Knife! is a +10 for click multiplier and +10 pts", img: knifeImg, lvlMultiplier: 10, initialPrice: 10000},
    {name: "Blue Gem!", description: "each Blue Gem! is a +20 for click multiplier and +20 pts", img: blueGemImg, lvlMultiplier: 20, initialPrice: 20000},
  ]

  async function createGame(){
      try{
        const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/game/create`, {"points": counterRef.current, "shopInfo": JSON.stringify(shopInfoRef.current)})
        localStorage.setItem("uuid", result.data.id)
        setUUID(localStorage.getItem("uuid"))
      }catch(err){
        console.log(err);
      }
  }

  async function updateGame(){
    try {
      if (!uuidRef.current) return; 
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/game/update/${uuidRef.current}`, {"points": counterRef.current, "shopInfo": JSON.stringify(shopInfoRef.current)})      
    } catch(err) {
      console.log(err);
    }
  }

  async function getGame(id) {
    try{
      const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/get/${id}`)
      setCounter(result.data.data.points)
      setShopInfo(JSON.parse(result.data.data.shopInfo))
    }catch(err){
      if(err.status == 404){
        await createGame()
      }
      console.log(err);
    }
  }

  useEffect(() => {
    try{
      if(!UUID){
        createGame()
      }else{
        getGame(UUID)
      }
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {updateGame(UUID)}, 30000)
    return () => clearInterval(interval)
  }, [])

  function handleClick(e){
    var multiplier = 1
    for (const item of shopMap) {
      multiplier += userShopInfo[item.name]?.level * item.lvlMultiplier
    }
    setCounter(prev => prev + (1 * multiplier))
    const newClick = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      amount: multiplier
    }
    setClicks(prev => [...prev, newClick])
    setTimeout(() => {
      setClicks(prev => prev.filter(click => click.id !== newClick.id))
    }, 800)
  }

  function handleShopClick(event, item){
    const price = item.initialPrice * (userShopInfo[item.name]?.level == 0 ? 1 : userShopInfo[item.name]?.level)
    if(counter >= price){
      if(event.shiftKey && counter >= price * 10){
        var tenprice = price
        for(var i = 1; i <= 10; i++){
          tenprice = tenprice + item.initialPrice
        }
        setCounter(prev => prev - (price * 10))
        userShopInfo[item.name].level += 10
      }else{
        setCounter(prev => prev - price)
        userShopInfo[item.name].level += 1
      }
    }else{
      toast.error("Not Enough Points!")
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

  if(loading){
    return (
      <div className='h-screen flex justify-center items-center'>
        <p>Loading...</p>
      </div>
    )
  }

  if(!loading){
    return (
      <div className='flex select-none min-h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans'>
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          theme="dark"
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          limit={3}
        />
        <style>
          {`
            @keyframes floatUp {
              0% { opacity: 1; transform: translateY(0) scale(1); }
              100% { opacity: 0; transform: translateY(-60px) scale(1.3); }
            }
            .animate-float {
              animation: floatUp 0.8s ease-out forwards;
            }
          `}
        </style>
        <div className='absolute top-6 left-6 z-10 bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700 shadow-2xl pointer-events-none'>
          <p className='text-gray-400 font-semibold tracking-wide uppercase text-sm mb-1'>
            Points per second: <span className="text-white">{formatNumberLong(pts)}</span>
          </p>
          <p className='text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-yellow-600 drop-shadow-sm'>
            {formatNumberLong(counter)}
          </p>
        </div>
        {clicks.map(click => (
          <div
            key={click.id}
            className="fixed z-50 text-3xl font-extrabold text-white pointer-events-none animate-float drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            style={{ left: click.x - 20, top: click.y - 20 }}
          >
            +{formatNumberLong(click.amount)}
          </div>
        ))}

        <div className='w-[70vw] flex items-center h-screen flex-col justify-center relative'>
          <img
            draggable={false}
            src={
              counter > 100000000 ? donkImg :
              counter > 50000000 ? s1mpleImg :
              counter > 10000000 ? ohneImg :
              counter > 1000000 ? furyImg :
              furyImg
            }
            alt="main image"
            className="w-64 md:w-80 lg:w-96 cursor-pointer drop-shadow-2xl transition-transform duration-100 hover:scale-105 active:scale-95"
            onClick={handleClick}
          />
        </div>
        <div className='w-[30vw] h-screen bg-gray-800 flex flex-col border-l border-gray-700 shadow-2xl z-20'>
                  <div className="p-5 border-b border-gray-700 bg-gray-800/80">
            <h2 className="text-2xl font-bold text-white tracking-wide">Shop</h2>
          </div>
          <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3'>
            {shopMap.map(item => {
              const currentPrice = item.initialPrice * (userShopInfo[item.name]?.level == 0 ? 1 : userShopInfo[item.name]?.level);
              const canAfford = counter >= currentPrice;

              return (
                <div 
                  key={item.name}
                  className={`group relative overflow-hidden flex items-center justify-between p-3 rounded-xl border transition-all duration-150 
                    ${canAfford 
                      ? 'bg-gray-700 border-gray-600 hover:border-gray-500 cursor-pointer shadow-md' 
                      : 'bg-gray-800 border-gray-700 opacity-60 cursor-not-allowed'}`}
                  onClick={() => handleShopClick(event, item)}
                >
                                  <div className="flex items-center gap-4 relative z-10 transition-opacity duration-200 group-hover:opacity-0">
                    <div className="bg-gray-900/50 p-2 rounded-lg">
                      <img draggable={false} src={item.img} alt={item.name} className="w-12 h-12 object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-bold text-lg text-white">{item.name}</p>
                      <p className={`text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                        Cost: {formatNumberLong(currentPrice)}
                      </p>
                    </div>
                  </div>

                  <p className='font-bold text-gray-300 text-2xl pr-2 relative z-10 transition-opacity duration-200 group-hover:opacity-0'>
                    {formatNumberLong(userShopInfo[item.name]?.level || 0)}
                  </p>
                  <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm flex flex-col justify-center items-center px-4 py-2 z-20 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <p className="text-gray-300 text-sm text-center leading-tight mb-2">
                      {item.description}
                    </p>
                    <div className="flex gap-4 font-bold text-sm">
                      <span className="text-gray-400">Level: {formatNumberLong(userShopInfo[item.name]?.level || 0)}</span>
                      <span className={canAfford ? 'text-yellow-400' : 'text-red-400'}>
                        Buy for {formatNumberLong(currentPrice)}
                      </span>
                    </div>
                    <p className='text-gray-500 text-[13px]'>hold shift to buy 10</p>
                  </div>

                </div>
              )
            })}
          </div>
          <div className='h-[15vh] border-t border-gray-700 bg-gray-900/50 p-5 flex flex-col justify-center'>
            <h3 className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-2">Upgrades</h3>
            <div className="text-gray-600 italic text-sm text-center">
              Coming soon...
            </div>
          </div>
          
        </div>
      </div>
    )
  }
}

export default App