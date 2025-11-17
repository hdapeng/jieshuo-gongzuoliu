declare global {
  interface Window {
    testTTSService: () => Promise<void>;
  }
}

// 测试TTS服务的简单脚本
import { ttsService } from './services/ttsServiceSimple';

async function testTTSService() {
  console.log('开始测试TTS服务...');
  
  try {
    const testText = "你好，这是一个测试语音生成的文本。";
    console.log('测试文本:', testText);
    
    const result = await ttsService.generateSpeech(testText, {
      voice: 'alloy',
      model: 'IndexTTS-2'
    });
    
    console.log('语音生成成功！数据大小:', result.byteLength, 'bytes');
    
    // 创建音频元素进行测试播放
    const blob = new Blob([result], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    console.log('正在播放测试音频...');
    await audio.play();
    
    // 3秒后清理
    setTimeout(() => {
      URL.revokeObjectURL(url);
      console.log('测试完成！');
    }, 3000);
    
  } catch (error) {
    console.error('TTS服务测试失败:', error);
  }
}

// 绑定到全局window对象以便在浏览器控制台中调用
(window as Window & typeof globalThis).testTTSService = testTTSService;

console.log('TTS测试服务已加载，在控制台输入 testTTSService() 来测试语音生成功能');