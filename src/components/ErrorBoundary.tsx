import { Component, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  resetKey: number;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, resetKey: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  handleReset = () => {
    this.setState(prev => ({ hasError: false, resetKey: prev.resetKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
          <p className="text-2xl font-black text-stone-700">앗, 문제가 생겼어요! 😥</p>
          <p className="text-stone-500 font-bold">걱정 마세요, 다시 시도해 볼까요?</p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-orange-400 text-white font-black text-lg rounded-2xl shadow-[0_4px_0_var(--color-orange-600)] hover:bg-orange-500 transition-colors"
          >
            <RefreshCw size={20} />
            다시 시작하기
          </button>
        </div>
      );
    }

    return <div key={this.state.resetKey}>{this.props.children}</div>;
  }
}
