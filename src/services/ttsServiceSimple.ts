// 简化的语音生成服务 - 使用原生fetch API
class TTSServiceSimple {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = (import.meta.env.VITE_GITEE_AI_API_KEY as string) || '';
    this.baseURL = 'https://ai.gitee.com/v1';
  }

  // 设置API密钥
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  // 获取当前API密钥
  getApiKey(): string {
    return this.apiKey;
  }

  // 生成语音
  async generateSpeech(text: string, options: {
    voice?: string;
    model?: string;
    promptAudioUrl?: string;
    promptText?: string;
    emoText?: string;
    useEmoText?: boolean;
  } = {}): Promise<{ audioData: ArrayBuffer; generateTime: number }> {
    try {
      const startTime = Date.now();
      const response = await fetch(`${this.baseURL}/audio/speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          input: text,
          model: options.model || 'IndexTTS-2',
          voice: options.voice || 'alloy',
          prompt_audio_url: options.promptAudioUrl || 'https://raw.githubusercontent.com/hdapeng/kelong-audio/master/kelong-audio/%E5%85%8B%E9%9A%86%E9%9F%B3%E8%89%B2.MP3',
          prompt_text: options.promptText || '对我来讲是一种荣幸，但是也是压力蛮大的。不过我觉得是一种呃很好的一个挑战。',
          emo_text: options.emoText || '你吓死我了！你是鬼吗？',
          use_emo_text: options.useEmoText !== false,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const generateTime = Math.floor((Date.now() - startTime) / 1000); // 计算生成时间（秒）
      return { audioData: arrayBuffer, generateTime };
    } catch (error) {
      console.error('语音生成失败:', error);
      throw new Error(`语音生成失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 批量生成语音
  async batchGenerateSpeech(texts: string[], options: {
    voice?: string;
    model?: string;
    promptAudioUrl?: string;
    promptText?: string;
    emoText?: string;
    useEmoText?: boolean;
  } = {}): Promise<ArrayBuffer[]> {
    const results: ArrayBuffer[] = [];
    
    for (let i = 0; i < texts.length; i++) {
      try {
        console.log(`正在生成第 ${i + 1}/${texts.length} 个语音...`);
        const { audioData } = await this.generateSpeech(texts[i], options);
        results.push(audioData);
        
        // 添加延迟以避免API限制
        if (i < texts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`生成第 ${i + 1} 个语音失败:`, error);
        results.push(new ArrayBuffer(0)); // 添加空数据作为占位符
      }
    }
    
    return results;
  }

  // 获取可用的声音选项
  getAvailableVoices(): string[] {
    return [
      'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
    ];
  }

  // 获取可用的模型选项
  getAvailableModels(): string[] {
    return [
      'IndexTTS-2', 'tts-1', 'tts-1-hd'
    ];
  }
}

export const ttsService = new TTSServiceSimple();

// 示例用法
// (async () => {
//   const { audioData } = await ttsService.generateSpeech("你好，世界！");
//   const blob = new Blob([audioData], { type: 'audio/mpeg' });
//   const url = URL.createObjectURL(blob);
//   const audio = new Audio(url);
//   audio.play();
// })();
