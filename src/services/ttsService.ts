import OpenAI from 'openai';

// 语音生成服务
class TTSService {
  private client: OpenAI;

  constructor() {
    const apiKey = (import.meta.env.VITE_GITEE_AI_API_KEY as string) || '';
    this.client = new OpenAI({
      baseURL: 'https://ai.gitee.com/v1',
      apiKey,
    });
  }

  // 生成语音
  async generateSpeech(text: string, options: {
    voice?: string;
    model?: string;
    promptAudioUrl?: string;
    promptText?: string;
    emoText?: string;
    useEmoText?: boolean;
  } = {}): Promise<ArrayBuffer> {
    try {
      // 创建请求数据对象，包含自定义参数
      const requestData = {
        input: text,
        model: options.model || 'IndexTTS-2',
        voice: options.voice || 'alloy',
        prompt_audio_url: options.promptAudioUrl || 'https://gitee.com/gitee-ai/moark-assets/raw/master/jay_prompt.wav',
        prompt_text: options.promptText || '对我来讲是一种荣幸，但是也是压力蛮大的。不过我觉得是一种呃很好的一个挑战。',
        emo_text: options.emoText || '你吓死我了！你是鬼吗？',
        use_emo_text: options.useEmoText !== false,
      };

      const response = await this.client.audio.speech.create(requestData as never);

      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
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
        const audioData = await this.generateSpeech(texts[i], options);
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

export const ttsService = new TTSService();
