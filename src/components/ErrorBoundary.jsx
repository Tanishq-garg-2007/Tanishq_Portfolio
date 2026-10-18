import React from 'react';

/**
 * ErrorBoundary for 3D subtrees (e.g. companion models)
 * Prevents a single missing or corrupt GLTF model from crashing the entire Canvas.
 */
export class CompanionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[CompanionErrorBoundary] Failed to load companion "${this.props.id}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Gracefully render nothing or a tiny placeholder rather than taking down the entire scene
      return null;
    }
    return this.props.children;
  }
}
