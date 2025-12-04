import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="flex justify-around items-center min-h-screen bg-[#f3de2c] font-league p-10">
      <section className="mt-10 ml-12 max-w-lg">
        <h1 className="font-bold text-8xl text-[#ff7b00] mb-7">Budgetify</h1>
        <h3 className="text-3xl text-[#0d3a5c] font-medium">
          We are helping individuals manage your funds and track expenses. No
          joining fees, no hassle.
        </h3>
        <Link to="/expenses" className="flex gap-2 items-center text-xl cursor-pointer">
          <button className="mt-10 bg-[#0d3a5c] text-amber-50 px-16 py-3 text-2xl rounded-xl cursor-pointer hover:bg-[#0b2e4c] transition">
            Start Now
          </button>
        </Link>
      </section>
      <section>
        <img src="./image.svg" alt="credit cards" className="w-[900px]" />
      </section>
    </div>
  )
}