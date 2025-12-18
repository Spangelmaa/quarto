// Server Component - keine 'use client' nötig!
// Wird auf dem Server gerendert und als statisches HTML geliefert

export function GameRules() {
  return (
    <div className="mt-8 p-5 bg-amber-50 rounded-lg border border-amber-200">
      <h3 className="font-bold mb-2 text-amber-900">📖 Spielregeln</h3>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
        <li>Jeder Spielstein hat 4 Eigenschaften: Farbe, Höhe, Form, Oberseite</li>
        <li>Spieler 1 wählt einen Stein, den Spieler 2 platzieren muss</li>
        <li>Dann wählt Spieler 2 einen Stein für Spieler 1</li>
        <li>Gewinner: Wer als Erster 4 Steine mit einer gemeinsamen Eigenschaft in einer Reihe hat</li>
        <li>Dies kann horizontal, vertikal oder diagonal sein</li>
      </ul>
    </div>
  );
}

// Erweiterte Regeln als eigene Komponente
export function ExtendedGameRules() {
  return (
    <div className="space-y-4">
      <GameRules />
      
      <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-bold mb-2 text-blue-900">💡 Tipps & Strategien</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li><strong>Defensive spielen:</strong> Achte darauf, welche Steine du deinem Gegner gibst</li>
          <li><strong>Mehrere Bedrohungen:</strong> Versuche Situationen zu schaffen, wo du zwei Möglichkeiten zu gewinnen hast</li>
          <li><strong>Zentrum kontrollieren:</strong> Die mittleren Felder bieten mehr Gewinnmöglichkeiten</li>
          <li><strong>Vorausplanen:</strong> Denke 2-3 Züge im Voraus</li>
        </ul>
      </div>
      
      <div className="p-5 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="font-bold mb-2 text-purple-900">🎮 Eigenschaften der Steine</h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
          <div>
            <strong>Farbe:</strong> Hell oder Dunkel
          </div>
          <div>
            <strong>Höhe:</strong> Groß oder Klein
          </div>
          <div>
            <strong>Form:</strong> Quadrat oder Rund
          </div>
          <div>
            <strong>Oberseite:</strong> Hohl oder Gefüllt
          </div>
        </div>
      </div>
    </div>
  );
}
