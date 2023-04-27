import { Link } from "react-router-dom";


const Public = () => {
  const content = (
    <section className="public">
      <header>
        <h1>Welcome to <span className="nowrap">Wide 수리점</span>        </h1>
      </header>
      <main className="public__main">
        <p>Located in Beautiful Downtown Suwon City, Wide 수리점은 최고의 직원들이 최고의 서비스로 제품을 수리해 드립니다.</p>

        <address className="public__address">
          Wide 수리점 <br />
          중부대로 2031번길 12 <br />
          수원, 경기도 12345 <br />
        </address>
        <br />

      </main>
      <footer>
        <Link to="/login">직원 Login</Link>
      </footer>

    </section>
  )
  return content
}

export default Public
