## 目标
- 在“视频搜索”页始终显示一个简约、常驻的筛选面板，与搜索框并列展示。
- 覆盖YouTube Data API v3可用的筛选属性，并支持你要求的播放量、点赞量、时长等维度。
- 将筛选条件与请求参数联动，执行搜索→补充详情→客户端二次筛选的完整流程。

## UI改造
- 布局：左侧为“筛选面板”，右侧为“结果列表”；顶部保留搜索输入与搜索按钮。
- 控件风格：复用当前简约风样式（`input`、`select`、`textarea`、`btn`、`card`）。
- 面板分组：
  1. 基本筛选
     - `q` 关键词
     - `order`（`date`/`rating`/`relevance`/`title`/`videoCount`/`viewCount`）
     - `publishedAfter`、`publishedBefore`（日期或日期时间）
     - `relevanceLanguage`、`regionCode`
     - `safeSearch`（`none`/`moderate`/`strict`）
  2. 视频属性筛选（Search API 支持）
     - `videoDuration`（`short`<4min、`medium`4–20min、`long`>20min）
     - `videoDefinition`（`high`/`standard`）
     - `videoCaption`（`any`/`closedCaption`）
     - `videoEmbeddable`（`true`/`any`）
     - `videoLicense`（`any`/`creativeCommon`）
     - `videoSyndicated`（`true`/`any`）
     - `videoType`（`any`/`episode`/`movie`）
     - `videoCategoryId`（下拉：常用分类）
  3. 扩展统计筛选（需二次拉取 `videos.list`）
     - 最小/最大 `viewCount`
     - 最小/最大 `likeCount`
     - 自定义时长范围（以秒：最小/最大），覆盖 `videoDuration` 粗粒度
  4. 结果控制
     - `maxResults`（默认 25）
     - `pageToken`（分页）
- 交互：任何筛选变更不会立即请求；点击“搜索”或回车触发查询；顶部显示当前筛选摘要。

## 状态与类型
- 新增 `SearchFilters` 类型（所有上述字段）。
- 在 `App.tsx` 中新增 `filters` 状态与 `setFilters` 方法；所有控件双向绑定。
- 将YouTube API Key来源统一：优先“设置”页中的值。

## 请求流程
1. 构造参数并调用 `search.list`：
   - `part=snippet`，`type=video`，映射筛选项到 API 参数（如 `videoDuration`、`order` 等）。
   - 返回 `items[].id.videoId` 与基础 `snippet`。
2. 对 `videoIds` 执行 `videos.list`：
   - `part=statistics,contentDetails`，拿到 `viewCount`、`likeCount`、`duration`（ISO8601）。
3. 客户端二次筛选：
   - 依据最小/最大播放/点赞和自定义时长范围过滤；解析 `contentDetails.duration` 为秒。
4. 结果呈现：
   - 列表卡片展示标题、描述、时长、播放/点赞、并保留“生成语音”按钮。
   - 支持分页：保存 `nextPageToken`/`prevPageToken`。

## 代码改动点（不执行，仅规划）
- `src/App.tsx`
  - 添加 `SearchFilters` 定义与 `filters` 状态；新增筛选面板 JSX；搜索时调用统一的 `performSearch(filters)`。
  - 在现有 mock 数据位置替换为真实调用管线（search→videos→过滤）。
- `src/services/youtubeService.ts`（若不存在则复用 `App.tsx` 内部函数）
  - `searchVideos(filters)`：封装 `search.list`，返回基本视频信息与 `pageToken`。
  - `fetchVideoDetails(ids)`：封装 `videos.list`，返回统计与时长。
  - `parseIsoDurationToSeconds(iso: string)`：ISO8601 时长解析。
- `设置`页
  - 保持 API Key 输入，供搜索模块读取。

## 参数映射一览
- Search API：
  - `q`、`order`、`publishedAfter`、`publishedBefore`、`relevanceLanguage`、`regionCode`、`safeSearch`
  - `videoDuration`、`videoDefinition`、`videoCaption`、`videoEmbeddable`、`videoLicense`、`videoSyndicated`、`videoType`、`videoCategoryId`
- 扩展（客户端过滤）：
  - `minViewCount`、`maxViewCount`、`minLikeCount`、`maxLikeCount`、`minDurationSec`、`maxDurationSec`

## 验证与体验
- 加载态与错误提示：顶部 alert 与按钮 loading。
- 空结果提示：展示可调整的建议（例如放宽时长或清除SafeSearch）。
- 性能：将 `videos.list` 并发批量请求（每次最多50个ID）；必要时做分页分批。

## 安全与限制
- 使用浏览器 `fetch`，避免泄露 API Key；桌面版可改为主进程代理请求。
- 遵守YouTube配额：尽量减少无效调用（仅在点击搜索时发起）。

## 交付
- 完成UI与联动后，保留简约风样式一致性；不改变现有“生成语音”“生成文案”功能。
- 提供参数到请求的明细列表与注释，便于后续扩展更多筛选。