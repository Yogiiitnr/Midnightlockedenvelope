import toast from 'react-hot-toast';

interface TemplateDefaults {
  secretHash?: string;
  note?: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (defaults: TemplateDefaults) => void;
}

const templates = [
  {
    id: 'test',
    icon: '🧪',
    name: 'Test Envelope',
    description: 'Quick test with pre-filled values',
    defaults: {
      note: 'Test envelope for development',
    },
  },
  {
    id: 'secure',
    icon: '🔒',
    name: 'Secure Transfer',
    description: 'High-security envelope for important secrets',
    defaults: {
      note: 'Secure time-locked transfer',
    },
  },
  {
    id: 'gift',
    icon: '🎁',
    name: 'Gift Envelope',
    description: 'Send a surprise to someone special',
    defaults: {
      note: 'Special gift envelope - reveal when ready!',
    },
  },
  {
    id: 'inheritance',
    icon: '👨‍👩‍👧',
    name: 'Inheritance Lock',
    description: 'Long-term storage for inheritance',
    defaults: {
      note: 'Inheritance envelope - to be claimed by beneficiary',
    },
  },
  {
    id: 'deadline',
    icon: '⏰',
    name: 'Deadline Payment',
    description: 'Payment locked until specific time',
    defaults: {
      note: 'Time-locked payment envelope',
    },
  },
  {
    id: 'escrow',
    icon: '🤝',
    name: 'Escrow Service',
    description: 'Neutral third-party escrow',
    defaults: {
      note: 'Escrow envelope - secure transaction',
    },
  },
];

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const handleSelect = (template: typeof templates[0]) => {
    onSelectTemplate(template.defaults);
    toast.success(`${template.icon} Template applied: ${template.name}`);
  };

  return (
    <div className="space-y-5 scale-in">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold aurora-text mb-1.5">Quick Templates</h2>
        <p className="opacity-60 text-sm">Select a template to auto-fill your envelope</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelect(template)}
            className="glass rounded-xl p-5 text-left transition-all hover:shadow-lg magnetic-button group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
              {template.icon}
            </div>
            <h3 className="text-base font-semibold mb-1.5">{template.name}</h3>
            <p className="text-xs opacity-60 leading-relaxed">{template.description}</p>
            
            <div className="mt-3 py-1.5 px-3 rounded-lg glass border border-purple-500/20 text-xs font-semibold inline-block">
              Use Template
            </div>
          </button>
        ))}
      </div>

      <div className="glass rounded-xl p-3.5 text-xs opacity-70">
        <div className="flex items-start gap-2">
          <span>💡</span>
          <div>
            <strong>How it works:</strong> Select a template to populate your envelope with common settings.
            You can customize all fields after applying.
          </div>
        </div>
      </div>
    </div>
  );
}
