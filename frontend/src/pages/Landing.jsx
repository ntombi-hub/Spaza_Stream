import { Link } from 'react-router-dom'

const features = [
  { icon: '🎙️', title: 'Voice-First', desc: 'Leave a quick voice note in Zulu, Xhosa, Sotho or English — no typing needed.' },
  { icon: '🤖', title: 'AI-Powered', desc: 'Whisper + GPT-4o automatically extract items, quantities and prices from your voice.' },
  { icon: '📦', title: 'Live Inventory', desc: 'Your stock levels update instantly in the cloud dashboard after every note.' },
  { icon: '🤝', title: 'Bulk Buying', desc: 'When 3+ nearby shops run low on the same item, a pooled order is created automatically — saving you 12%.' },
  { icon: '🚚', title: 'Smart Delivery', desc: 'Truck routes into townships are optimised automatically across all participating shops.' },
  { icon: '📶', title: 'Low Bandwidth', desc: 'Designed for township connectivity — lightweight audio uploads, minimal data usage.' },
]

const steps = [
  { n: '01', title: 'Record a voice note', desc: 'Say what you bought or what\'s running low. Any language, any accent.' },
  { n: '02', title: 'AI processes it', desc: 'Whisper transcribes, GPT-4o extracts the data. Done in seconds.' },
  { n: '03', title: 'Inventory updates', desc: 'Your dashboard reflects the new stock levels in real time.' },
  { n: '04', title: 'Bulk orders form', desc: 'If nearby shops need the same item, SpazaStream pools the order and negotiates a discount.' },
]

export default function Landing() {
  return (
    <div className="bg-white text-gray-800">

      {/* Hero */}
      <section className="bg-green-700 text-white py-24 px-6 text-center">
        <p className="text-green-300 text-sm font-semibold tracking-widest uppercase mb-3">Voice · AI · Supply Chain</p>
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6">
          Run your spaza shop<br />smarter, not harder.
        </h1>
        <p className="text-green-100 text-lg max-w-xl mx-auto mb-10">
          SpazaStream turns your voice notes into live inventory data — and automatically coordinates bulk buying across your neighbourhood.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/upload"
            className="bg-white text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors"
          >
            🎙️ Upload a Voice Note
          </Link>
          <Link
            to="/inventory"
            className="border border-white text-white font-bold px-8 py-3 rounded-full hover:bg-green-600 transition-colors"
          >
            📦 View Inventory
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-green-800 text-white py-6 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 text-center gap-4">
          {[['4', 'Languages supported'], ['12%', 'Bulk buying discount'], ['3+', 'Shops to trigger bulk order']].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-green-300">{val}</p>
              <p className="text-xs text-green-200 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-800">Everything your shop needs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="border rounded-xl p-6 hover:shadow-md transition-shadow">
              <p className="text-3xl mb-3">{f.icon}</p>
              <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">How it works</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {steps.map(s => (
              <div key={s.n} className="flex gap-4">
                <span className="text-4xl font-extrabold text-green-200 leading-none">{s.n}</span>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-800">Speaks your language</h2>
        <p className="text-gray-500 mb-8 text-sm">Whisper AI auto-detects the language — no setup needed.</p>
        <div className="flex flex-wrap justify-center gap-4">
          {[['🇿🇦', 'Zulu', 'isiZulu'], ['🇿🇦', 'Xhosa', 'isiXhosa'], ['🇿🇦', 'Sotho', 'Sesotho'], ['🇬🇧', 'English', 'English']].map(([flag, name, native]) => (
            <div key={name} className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 text-center">
              <p className="text-2xl mb-1">{flag}</p>
              <p className="font-bold text-green-800 text-sm">{name}</p>
              <p className="text-xs text-gray-400">{native}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to streamline your shop?</h2>
        <p className="text-green-200 mb-8 max-w-md mx-auto text-sm">
          Upload your first voice note and watch your inventory update automatically.
        </p>
        <Link
          to="/upload"
          className="bg-white text-green-700 font-bold px-10 py-3 rounded-full hover:bg-green-50 transition-colors"
        >
          Get Started — It's Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-xs">
        🏪 SpazaStream AI · Built for South African township entrepreneurs
      </footer>

    </div>
  )
}
