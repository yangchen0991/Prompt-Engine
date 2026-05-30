// TokenDance API 适配器
// 网关基础地址：https://tokendance.space/gateway
const BASE_URL = 'https://tokendance.space/gateway';

interface ImageGenParams {
  prompt: string;
  model: string;
  width?: number;
  height?: number;
}

interface VideoGenParams {
  prompt: string;
  model: string;
  duration?: number;
  protocol?: 'seedance' | 'happyhorse';
}

interface ChatParams {
  model: string;
  messages: { role: string; content: string }[];
  stream?: boolean;
}

export class TokenDanceAdapter {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // 同步图片生成（openai:image-generations / ark:image-generations）
  async generateImage(params: ImageGenParams): Promise<string> {
    // seedream 使用 ark 协议，ernie-image 使用 openai 协议
    const isArk = params.model === 'seedream-5.0-lite';
    const endpoint = isArk
      ? `${BASE_URL}/ark/v3/images/generations`
      : `${BASE_URL}/v1/images/generations`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        model: params.model,
        prompt: params.prompt,
        n: 1,
        size: `${params.width ?? 1024}x${params.height ?? 1024}`,
        response_format: 'url',
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`图片生成失败: ${err}`);
    }
    const data = await res.json();
    return data.data?.[0]?.url ?? '';
  }

  // 异步视频生成 - 提交任务（seedance / happyhorse 协议）
  async submitVideoTask(params: VideoGenParams): Promise<string> {
    const protocol = params.protocol ?? 'seedance';
    let endpoint: string;
    let body: Record<string, unknown>;

    if (protocol === 'happyhorse') {
      // HappyHorse 协议：/alibaba/happyhorse/v1/video-synthesis
      endpoint = `${BASE_URL}/alibaba/happyhorse/v1/video-synthesis`;
      body = { model: params.model, prompt: params.prompt };
    } else {
      // Seedance 协议：/ark/v3/seedance/generations/tasks
      endpoint = `${BASE_URL}/ark/v3/seedance/generations/tasks`;
      body = { model: params.model, prompt: params.prompt };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`视频任务提交失败: ${err}`);
    }
    const data = await res.json();
    return data.id ?? data.task_id ?? '';
  }

  // 异步任务轮询（seedance / happyhorse）
  async pollTask(taskId: string, protocol: 'seedance' | 'happyhorse' = 'seedance'): Promise<{ status: string; url?: string }> {
    const endpoint = protocol === 'happyhorse'
      ? `${BASE_URL}/alibaba/happyhorse/v1/video-synthesis/${taskId}`
      : `${BASE_URL}/ark/v3/seedance/generations/tasks/${taskId}`;

    const res = await fetch(endpoint, { headers: this.headers });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`任务轮询失败: ${err}`);
    }
    const data = await res.json();
    const status = data.status ?? 'processing';
    const url = data.video_url ?? data.output?.video_url ?? data.result?.url;
    return { status, url };
  }

  // 对话（openai:chat-completions）
  async chat(params: ChatParams): Promise<string> {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        stream: false,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`对话失败: ${err}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  }
}

let adapterInstance: TokenDanceAdapter | null = null;

export function getAdapter(apiKey: string): TokenDanceAdapter {
  if (!adapterInstance || (adapterInstance as any).apiKey !== apiKey) {
    adapterInstance = new TokenDanceAdapter(apiKey);
  }
  return adapterInstance;
}
