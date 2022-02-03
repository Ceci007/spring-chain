import { useState} from 'react'
import {
  useTransition,
  useSpring,
  useChain,
  config,
  animated,
  useSpringRef,
} from "@react-spring/web"
import data from './data'
import styles from "./styles.module.css"

export default function App() {
  const [open, setOpen] = useState<boolean>(false)
  const [option, setOption] = useState<string>("")
  const [rotateChevron, setRotateChevron] = useState<boolean>(false)

  const rotate = rotateChevron ? "rotate(180deg)" : "rotate(0)"

  const handleOpen = () => {
    setRotateChevron(rotateChevron => !rotateChevron)
    setTimeout(() => {
      setOpen(open => !open)
    }, 300)
  }

  const onOptionSelect = (value: string) => () => {
    setOption(value);
  }

  const springApi = useSpringRef()

  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: "20%", background: "white" },
    to: {
      size: open ? "100%" : "20%",
      background: open ? "white" : "white",
    }
  });

  const transApi = useSpringRef()
  const transition = useTransition(open ? data : [], {
    ref: transApi,
    trail: 400 / data.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  useChain(open ? [springApi, transApi] : [transApi, springApi], [
    0,
    open ? 0.1 : 0.9,
  ])

  const label = useSpring({
    delay: 1500,
    transform: open ? "translate3D(0,-60px,0)" : "translate3D(0,0,0)",
    opacity: open ? 0 : 1
  })

  return (
    <div className={styles.wrapper}>
      <animated.div
        style={{ ...rest, width: "90%", height: size }}
        className={styles.container}
        onClick={handleOpen}
      >
        { !open &&
          <animated.div style={label} className={styles.select}>
            <h3 className={styles.label}>{ option || "Select a gradient"}
            <animated.i 
              className="fas fa-chevron-down"
              style={{ transform: rotate, transition: "all 0.2s linear" }}
            ></animated.i>
            </h3>
          </animated.div>
        }
        { transition((style, item) => (
          <animated.div 
            className={styles.item}
            style={{...style, background: item.css }}
            onClick={onOptionSelect(item.name)}
          />
        ))

        }
      </animated.div>
    </div>
  )
}