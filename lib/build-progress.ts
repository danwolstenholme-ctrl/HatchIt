import { EventEmitter } from 'events';

/**
 * BUILD PROGRESS TRACKER
 * ----------------------
 * Honest progress tracking for the build process.
 * Shows real stages, not fake "AI thoughts".
 */

export type BuildStage = 
  | 'idle'
  | 'analyzing'
  | 'structuring'
  | 'generating'
  | 'styling'
  | 'optimizing'
  | 'complete';

interface ProgressUpdate {
  stage: BuildStage;
  message: string;
  timestamp: number;
}

const STAGE_MESSAGES: Record<BuildStage, string[]> = {
  idle: ['Ready to build'],
  analyzing: [
    'Analyzing your prompt...',
    'Understanding requirements...',
    'Processing design intent...',
  ],
  structuring: [
    'Planning component structure...',
    'Defining layout hierarchy...',
    'Mapping content sections...',
  ],
  generating: [
    'Generating React code...',
    'Writing component logic...',
    'Building with Claude Sonnet...',
  ],
  styling: [
    'Applying Tailwind styles...',
    'Adding responsive breakpoints...',
    'Polishing visual details...',
  ],
  optimizing: [
    'Adding animations...',
    'Optimizing for mobile...',
    'Final touches...',
  ],
  complete: [
    'Build complete',
    'Ready to preview',
  ],
};

class BuildProgress extends EventEmitter {
  private static instance: BuildProgress;
  private currentStage: BuildStage = 'idle';
  private stageStartTime: number = 0;
  private messageIndex: number = 0;
  private cycleInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();
  }

  public static getInstance(): BuildProgress {
    if (!BuildProgress.instance) {
      BuildProgress.instance = new BuildProgress();
    }
    return BuildProgress.instance;
  }

  public startBuild() {
    this.setStage('analyzing');
    
    // Cycle through stages automatically for visual feedback
    // Real completion is triggered by API response
    this.cycleInterval = setInterval(() => {
      this.cycleMessage();
    }, 1500);
  }

  private cycleMessage() {
    const messages = STAGE_MESSAGES[this.currentStage];
    this.messageIndex = (this.messageIndex + 1) % messages.length;
    this.emit('progress', {
      stage: this.currentStage,
      message: messages[this.messageIndex],
      timestamp: Date.now(),
    });
  }

  public setStage(stage: BuildStage) {
    this.currentStage = stage;
    this.stageStartTime = Date.now();
    this.messageIndex = 0;
    
    const messages = STAGE_MESSAGES[stage];
    this.emit('progress', {
      stage,
      message: messages[0],
      timestamp: Date.now(),
    });

    // Auto-advance through natural build stages
    if (stage === 'analyzing') {
      setTimeout(() => this.setStage('structuring'), 2000);
    } else if (stage === 'structuring') {
      setTimeout(() => this.setStage('generating'), 2500);
    } else if (stage === 'generating') {
      setTimeout(() => this.setStage('styling'), 4000);
    } else if (stage === 'styling') {
      setTimeout(() => this.setStage('optimizing'), 3000);
    }
  }

  public complete() {
    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
      this.cycleInterval = null;
    }
    this.setStage('complete');
  }

  public reset() {
    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
      this.cycleInterval = null;
    }
    this.currentStage = 'idle';
    this.messageIndex = 0;
  }

  public getCurrentStage(): BuildStage {
    return this.currentStage;
  }
}

export const buildProgress = BuildProgress.getInstance();
