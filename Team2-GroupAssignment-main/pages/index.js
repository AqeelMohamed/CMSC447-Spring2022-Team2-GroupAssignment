import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'

const MapWithNoSSR = dynamic(() => import('../components/map/Map'), {
  ssr: false,
})

export default function Home() {
  return (
    <>
      <title>Washington D.C. Crime Statistics</title>
      <main>
        <div className="Title">
          <h1>Washington D.C. Crime Statistics</h1>
        </div>
        <div className="Map">
          <MapWithNoSSR className={styles.map} />
        </div>
      </main>
    </>
  )
}
