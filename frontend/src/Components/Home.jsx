import Banner from './Banner'
import Categories from './Catogories'
import Recipes from './flavorProduct'
import Learn from './Learn'
import Posts from './Posts'
import MoreProduct from './MoreProduct'
import Subscribe from './Subscribe'
const Home = () => {
    return (

        <div>
            <Banner />
            <div style={{ marginTop: "100px" }}>
                <Categories />
                <Recipes />
                <Learn />
                <Posts />
                <MoreProduct count={8} />
                <Subscribe />
            </div>
        </div>
    )
}

export default Home
