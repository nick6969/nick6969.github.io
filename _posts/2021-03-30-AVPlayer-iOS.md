---
layout: post
title:  "iOS AVPlayer Play Audio"
date:   2021-03-30 23:00:00 +0800
permalink: "iOS/AVPlayer"
tags: [ iOS , Swift , AVPlayer, AVAudioSession , AudioSession , Audio , AVPlayerItem ]
categories: Swift
---

`iOS` `Swift` `AVPlayer` `AVAudioSession` `AudioSession` `Audio` `AVPlayerItem`

### 這篇主要是介紹 <a href="https://developer.apple.com/documentation/avfoundation/avplayer" target="_">AVPlayer</a> 播放聲音

<br>

在 iOS 裡面播放 mp3 / .m3u8 的聲音真的超級簡單

```swift
var player: AVPlayer = AVPlayer(playerItem: nil)

func play(with url: URL) throws {
        
    let session: AVAudioSession = AVAudioSession.sharedInstance()
    try session.setCategory(.playback)
        
    let asset: AVURLAsset = AVURLAsset(url: url)
    let playItem: AVPlayerItem = AVPlayerItem(asset: asset)
    player = AVPlayer(playerItem: playItem)
    
    player.play()
}
```

只需要上面這一段就搞定了

<font color="#FF0000">打完 收工~ (謎之音: 不要騙台錢了 回來講清楚啊~</font>

<br>

------ 這是分隔線，真的只要上面這一段就搞定，只是還有很多需要做的事，讓我們繼續看下去 ------

<br>

上張圖 說明一下在系統中，聲音的處理架構 (Apple Documentation)
<figure>
<a><img src="https://developer.apple.com/library/archive/documentation/Audio/Conceptual/AudioSessionProgrammingGuide/Art/ASPG_intro_2x.png"></a>
</figure>

來源: <a href="https://developer.apple.com/library/archive/documentation/Audio/Conceptual/AudioSessionProgrammingGuide/Introduction/Introduction.html" target="_">https://developer.apple.com/library/archive/documentation/Audio/Conceptual/AudioSessionProgrammingGuide/Introduction/Introduction.html</a>

基本上就是 Input / Output 都由系統處理，開發者只需要使用 AVAudioSession 跟系統溝通就好.

<br>

<a href="https://developer.apple.com/documentation/avfaudio/avaudiosession" target="_">AudioSession 官方說明在這裡</a>

<a href="https://developer.apple.com/documentation/avfaudio/avaudiosession/category" target="_">Category 清單在這裡</a>

首先我們要先向系統註冊我們要使用的聲音類別，我們單純只播放聲音，所以只需要設定成 playback

```swift
let session = AVAudioSession.sharedInstance()
do {
    try session.setCategory(.playback)
} catch {
     print("Failed to set audio session category.")
}
```

設定好 AVAudioSession 之後就開始我們的 AVPlayer 之旅了

<br>

AVPlayer 有兩種 init 的方式. 個人都是使用後者，本系列文章都是以第二種 init 方式來開始的.

<a href="https://developer.apple.com/documentation/avfoundation/avplayer/1385706-init" target="_">init(url: URL)</a> , <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1387104-init" target="_">init(playerItem: AVPlayerItem?)</a>

介紹一個屬性 <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1387569-currentitem" target="_">var currentItem: AVPlayerItem? { get }</a>

他就是現在當下要播放的 Item

<br>

當我們可以播放音樂的時候，我們就會開始有各種需求

接下來就開始談會有的需求，順便說明要怎樣實現需求.

<br>

#### <font color="#FF8800">1. 要知道 AVPlayer 這一個 instance 準備好可以使用了</font>

當你 init 一個 AVPlayer 的時候，也要需要先知道這一個 instance 是不是可以正常的使用了

這時候我們可以在 <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1388096-status" target="_">var status: AVPlayer.Status { get }</a> 這個屬性判斷，官方建議直接對這 status 實行 KVO(Key-Value-Observing)

如果拿到 .failed 的時候，就可以去拿 <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1387764-error" target="_">var error: Error? { get }</a> 來得知為什麼 error 了

當 status 變成 .readyToPlay 就可以繼續往下走了.

<br>

#### <font color="#FF8800">2. 要知道讀取的狀況</font>

當你提供一個 m3u8 的 URL，請 AVPlayer 播放的時候，系統會先去下載 m3u8 檔案，然根據檔案的內容去下載每一個分段．

如果網址是錯誤的，如果 m3u8 檔案的內容是有問題的，當下沒有網路讀不到也是一種問題，這時候要怎樣得知呢.

這時候我們可以在 <a href="https://developer.apple.com/documentation/avfoundation/avplayeritem/1389493-status" target="_">var status: AVPlayerItem.Status { get }</a> 這個屬性判斷，官方建議直接對這 status 實行 KVO <font color="#FF0000">(坑1，寫在最後面)</font>

如果拿到 .failed 的時候，就可以去拿 <a href="https://developer.apple.com/documentation/avfoundation/avplayeritem/1389185-error" target="_">var error: Error? { get }</a> 來得知為什麼 error 了

當 status 變成 .readyToPlay 就可以繼續往下走了.(此時還沒開始下載 m3u8 裡面網址的內容)

<font color="#FF0000">溫馨小提醒 這一個 status 以及 error 是 AVPlayerItem 的跟上一個 AVPlayer 的 status 以及 error 是完全不同的，請不要混在一起了.</font>

<br>

接下來就是系統要載入 m3u8 裡面的網址的內容到擁有足夠的緩衝來開始播放.

我們可以在系統提供的 <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1643485-timecontrolstatus" target="_">var timeControlStatus: AVPlayer.TimeControlStatus { get }</a> 來得到狀態

timeControlStatus 有三種狀態， <font color="#0000FF">paused</font> / <font color="#0000FF">waitingToPlayAtSpecifiedRate</font> / <font color="#0000FF">playing</font>

官方一樣建議直接對 timeControlStatus 實行 KVO

playing / paused 很直觀了，就不解釋了

當狀態是在 waitingToPlayAtSpecifiedRate 的時候，就是表示還在等待載入

這時候就可以去看載入的狀況 <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1643486-reasonforwaitingtoplay" target="_">var reasonForWaitingToPlay: AVPlayer.WaitingReason? { get }</a>

AVPlayer.WaitingReason 有三種狀態， <font color="#0000FF">evaluatingBufferingRate</font> / <font color="#0000FF">noItemToPlay</font> / <font color="#0000FF">toMinimizeStalls</font>

另外如果想要知道完整的 loading 細節，可以拿 <a href="https://developer.apple.com/documentation/avfoundation/avplayeritem/1387573-errorlog" target="_">func errorLog() -> AVPlayerItemErrorLog?</a> 跟 <a href="https://developer.apple.com/documentation/avfoundation/avplayeritem/1388499-accesslog" target="_">func accessLog() -> AVPlayerItemAccessLog?</a> 來得知

也可以接收系統的 Notification 來得知有新的 errorLog <a href="https://developer.apple.com/documentation/foundation/nsnotification/name/1388450-avplayeritemnewerrorlogentry" target="_">AVPlayerItemNewErrorLogEntry</a> 或是有新的 accessLog <a href="https://developer.apple.com/documentation/foundation/nsnotification/name/1388553-avplayeritemnewaccesslogentry" target="_">AVPlayerItemNewAccessLogEntry</a>

<br>
給張圖，這張圖就是從 init AVPlayer 到 播放出聲音中間的流程.
<figure>
<a><img src="{{site.url}}/asset/AVPlayer_Flow.png"></a>
</figure>
<br>

#### <font color="#FF8800">3. 要知道播放的這一首總長度是多少</font>

可以從 <a href="https://developer.apple.com/documentation/avfoundation/avplayeritem/1389386-duration" target="_">var duration: CMTime { get }</a> 拿到總長度

這裡出現了一個 <a href="https://developer.apple.com/documentation/coremedia/cmtime" target="_">CMTime</a> 的型別.

簡單來說，CMTime 相對於 TimeInterval 如同於 Decimal 相對於 Double. CMTime 就是一個可以精確指定時間的型別. 想要更詳細知道 CMTime 的，請自己 google.

這裡列出 TimeInterval 跟 CMTime 互轉的 extension.

```swift
extension TimeInterval {
    var cmTime: CMTime {
        return CMTimeMakeWithSeconds(self, preferredTimescale: 600)
    }
}
extension CMTime {
    var timeInterval: TimeInterval {
        return CMTimeGetSeconds(self)
    }
}
```

官方建議直接對這 duration 實行 KVO

要特別注意有可能會拿到 <a href="https://developer.apple.com/documentation/coremedia/cmtime/1400777-indefinite" target="_">static let indefinite: CMTime</a>

這一個是表示時間未知的，請使用 <a href="https://developer.apple.com/documentation/coremedia/1489754-cmtime_is_indefinite" target="_">func CMTIME_IS_INDEFINITE(_ time: CMTime) -> Bool</a> 來判斷

<br>

#### <font color="#FF8800">4. 要知道播放到哪了</font>

可以從 <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1390404-currenttime" target="_">func currentTime() -> CMTime</a> 拿到當下播放到的時間

另外系統有提供一個 func 可以定期取得播放進度時間 

<a href="https://developer.apple.com/documentation/avfoundation/avplayer/1385829-addperiodictimeobserver" target="_">func addPeriodicTimeObserver(forInterval interval: CMTime, queue: DispatchQueue?, using block: @escaping (CMTime) -> Void) -> Any</a>

因為是 Observer，當然也提供了 remove <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1387552-removetimeobserver" target="_">func removeTimeObserver(_ observer: Any)</a>

這一個 Observer 通常會設定一秒呼叫一次，以便更新當下的播放時間給使用者.

<br>

#### <font color="#FF8800">5. 要可以控制播放 (播放.暫停.播放速度.快轉.倒轉)</font>

播放的話，各位在前面都應該已經看過了. <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1386726-play" target="_">func play()</a>

暫停也是很直覺的. <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1387895-pause" target="_">func pause()</a>

接下來講講 <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1388846-rate" target="_">var rate: Float { get set }</a>

這是一個當下指示播放速度的變數，更改播放速度可以直接修改這個值，但是這個值也會影響到播放狀態

當這個 rate 等於 0 的時候，這時候播放狀態就會變成暫停，當一般開始播放的時候， rate 就會等於 1

所以一般情況下直接 play 開始播放的時候 rate 會是 1，如果要開始播放就是特定的速率的話

就要使用另外一個可以直接指定速度的 <a href="https://developer.apple.com/documentation/avfoundation/avplayer/1643480-playimmediately" target="_">func playImmediately(atRate rate: Float)</a> 來播放

快轉跟倒轉用的其實是同一個系列的 function，都是 seek. seek 系列有六個 function，我只挑兩個常用的來解釋.

<a href="https://developer.apple.com/documentation/avfoundation/avplayer/1387018-seek" target="_">func seek(to time: CMTime, completionHandler: @escaping (Bool) -> Void)</a>

這一個就是移動到指定的時間，completionHandler 裡面的 Bool 值，就是會告訴你移動成功與否，舉兩個會移動失敗的案例，第一 秒數小於 0，第二 秒數大於這一首的總長。

所以我自己習慣會先預計要移動到的時間是不是小於 0，或者是大於這一首的總長，若是不在範圍內，就會做一些相對應的調整，而不是等 completionHandler 再來處理失敗的狀況

<a href="https://developer.apple.com/documentation/avfoundation/avplayer/1388493-seek" target="_">func seek(to time: CMTime, toleranceBefore: CMTime, toleranceAfter: CMTime, completionHandler: @escaping (Bool) -> Void)</a>

這一個就是移動到指定的時間，但是允許誤差，toleranceBefore 跟 toleranceAfter 就是聲明往前往後的誤差，上方的 seek to time 等同於容許無限大的誤差.

為什麼會有允許誤差的需求，這要從 m3u8 的檔案來說起，m3u8 指定了每個 ts 檔案的路徑，每一個 ts 檔案可能是特定的秒數，一般來說都是 10 秒

假設你移動到 19.8 秒的位置，如果不允許誤差，這時候就要先下載 10~20 秒這一個 ts，可是只播最後 0.2 秒，是一個浪費流量，也讓使用者等更久的時間，所以會有允許誤差的 function.

<br>

#### <font color="#FF8800">6. 要知道播放到底了</font>

系統提供的只有一個方式，接收系統的 Notification

<a href="https://developer.apple.com/documentation/foundation/nsnotification/name/1386566-avplayeritemdidplaytoendtime" target="_">static let AVPlayerItemDidPlayToEndTime: NSNotification.Name</a>

你可以在 Notification 的 object 拿到播放完成的那一個 AVPlayerItem.

<br>

#### <font color="#FF8800">7. 要知道播放被中斷了,中斷之後要怎樣處理</font>

基本上就是接收系統的 Notification，然後再根據中斷的模式來決定怎樣做

<a href="https://developer.apple.com/documentation/avfaudio/avaudiosession/1616596-interruptionnotification" target="_">class let interruptionNotification: NSNotification.Name</a>

處理的方式如下，這一段 Code 取自 Apple 官方文件, <a href="https://developer.apple.com/documentation/avfaudio/avaudiosession/responding_to_audio_session_interruptions" target="_">Apple Documentation</a>

```swift
@objc 
func handleInterruption(notification: Notification) {
    guard let userInfo = notification.userInfo,
        let typeValue = userInfo[AVAudioSessionInterruptionTypeKey] as? UInt,
        let type = AVAudioSession.InterruptionType(rawValue: typeValue) else {
            return
    }

    // Switch over the interruption type.
    switch type {

    case .began:
        // An interruption began. Update the UI as necessary.

    case .ended:
       // An interruption ended. Resume playback, if appropriate.
        guard let optionsValue = userInfo[AVAudioSessionInterruptionOptionKey] as? UInt else { return }
        let options = AVAudioSession.InterruptionOptions(rawValue: optionsValue)
        if options.contains(.shouldResume) {
            // An interruption ended. Resume playback.
        } else {
            // An interruption ended. Don't resume playback.
        }

    default: ()
    }
}
```

<br>

#### <font color="#FF8800">8. 要知道播放到一半突然失敗了</font>

系統提供的只有一個方式，接收系統的 Notification

<a href="https://developer.apple.com/documentation/foundation/nsnotification/name/1388007-avplayeritemfailedtoplaytoendtim" target="_">static let AVPlayerItemFailedToPlayToEndTime: NSNotification.Name</a>

然後可以在收到 notification 的 userInfo 裡面

使用 <a href="https://developer.apple.com/documentation/avfoundation/avplayeritemfailedtoplaytoendtimeerrorkey" target="_">let AVPlayerItemFailedToPlayToEndTimeErrorKey: String</a> key 來取得 error

```swift
@objc
func handleFailedToPlayToEndTime(_ notification: Notification) {
    let error = notification.userInfo?[AVPlayerItemFailedToPlayToEndTimeErrorKey] as? Error
    print(error)
}
```

<br>

#### <font color="#FF8800">9. 要可以控制系統音量</font>

基本上播放聲音的 App 都會有 UI 可以讓使用者調整音量，官方只提供了一個調整音量的 UI，

就是 <a href="https://developer.apple.com/documentation/mediaplayer/mpvolumeview" target="_">class MPVolumeView : UIView</a>

使用者使用實體音量鍵調整音量，MPVolumeView 也會對應的調整，但是長得真的就是一個 UISlider 的樣子，很難跟其他的 UI 混在一起使用

<br>

#### <font color="#FF8800">10. 要在背景可以繼續播放</font>

Xcode -> Select project -> Signing & Capabilities -> Click +Capabilities -> Select background modes -> tick Audio, AirPlay and Picture in Picture

搞定

<br>

#### <font color="#FF8800">11. 要可以接受外部的控制</font>

只要設定 <a href="https://developer.apple.com/documentation/mediaplayer/mpremotecommandcenter" target="_">MPRemoteCommandCenter</a> 就可以設定好了

因為整個 iOS 系統，都是同一個 RemoteCommandCenter，所以官方說請直接使用 shared()

Command 列表在這裡 <a href="https://developer.apple.com/documentation/mediaplayer/mpremotecommandcenter" target="_">Apple Documentation</a>，有點多，就不一一介紹.

上範例 Code，用範例 Code 來解釋

```swift
func setupRemoteCommand() {

    let center = MPRemoteCommandCenter.shared()

    // 不使用 上一首
    center.previousTrackCommand.isEnabled = false

    // 不使用 下一首
    center.nextTrackCommand.isEnabled = false

    // 使用 快轉
    center.skipForwardCommand.isEnabled = true
    // 這裡是快轉秒數，根據經驗，如果不是 5 的倍數，畫面只會顯示快轉的符號，不會包含數字
    center.skipForwardCommand.preferredIntervals = [NSNumber(15)]
    center.skipForwardCommand.addTarget(self, action: #selector(skipForwardCommand(_:)))

    // 使用 倒轉
    center.skipBackwardCommand.isEnabled = true
    // 這裡是倒轉秒數，根據經驗，如果不是 5 的倍數，畫面只會顯示倒轉的符號，不會包含數字
    center.skipBackwardCommand.preferredIntervals = [NSNumber(15)]
    center.skipBackwardCommand.addTarget(self, action: #selector(skipBackwardCommand(_:)))

    // 使用 播放
    center.playCommand.isEnabled = true
    center.playCommand.addTarget(self, action: #selector(playCommand(_:)))

    // 使用 暫停
    center.pauseCommand.isEnabled = true
    center.pauseCommand.addTarget(self, action: #selector(pauseCommand(_:)))

    // 設定進度條可以拖動
    center.changePlaybackPositionCommand.isEnabled = true
    center.changePlaybackPositionCommand.addTarget { event in
        guard let positionEvent = event as? MPChangePlaybackPositionCommandEvent else { return .commandFailed }
        let time: TimeInterval = positionEvent.positionTime
        // 根據使用者拖動到的位置的時間做調整
        return .success
    }
}

@objc
func playCommand(_ event: MPRemoteCommandEvent) -> MPRemoteCommandHandlerStatus {
    // 根據接收到的 command 做對應的處理，若是無法做對應的處理， return MPRemoteCommandHandlerStatus.commandFailed
    return .success
}
```

<br>

#### <font color="#FF8800">12. 要可以顯示在鎖定畫面上</font>

系統只提供一個方式，就是使用設置 MPNowPlayingInfoCenter.default().nowPlayingInfo，根據個人測試，沒有設定 MPRemoteCommandCenter，就不會出現在畫面上.

<a href="https://developer.apple.com/documentation/mediaplayer/mpnowplayinginfocenter/1615903-nowplayinginfo" target="_">var nowPlayingInfo: [String : Any]? { get set }</a>

官方有說明不用一直去設定，系統自己會根據你提供的速度跟當下時間，繼續往前走.所以

nowPlayingInfo 有定義好的 key，每個 key 都有指定的 value type，因為太多了，就不一一介紹，請自行參考官方文件 <a href="https://developer.apple.com/documentation/mediaplayer/mpmediaitem/general_media_item_property_keys" target="_">General Media Item Property Keys</a>

這裡只用個範例 code 來說明一下常用的幾個 key <font color="#FF0000">(坑2，寫在最後面)</font>

```swift
// 設定
MPNowPlayingInfoCenter.default().nowPlayingInfo = [
    // 你要顯示的標題-例如: 專輯名稱
    MPMediaItemPropertyTitle: "iOS@Taipei", 
    // 你要顯示的圖篇標題-例如: 歌曲名稱
    MPMediaItemPropertyAlbumTitle: "Nick", 
    // 這是只當下的播放速率，系統要知道你用的播放速率，才能用一樣的速率去更新播放的時間
    MPNowPlayingInfoPropertyPlaybackRate: 1, 
    // 現在播放到的位置
    MPNowPlayingInfoPropertyElapsedPlaybackTime: 10, 
    // 這一首聲音的總長度
    MPMediaItemPropertyPlaybackDuration: 180, 
    // 這裡要放入的是你要顯示的圖片大小跟圖片
    MPMediaItemPropertyArtwork: MPMediaItemArtwork(boundsSize: CGSize(width: 100, height: 100)) { size -> UIImage in
        print(size)
        return UIImage()
    }
]

// 清除
MPNowPlayingInfoCenter.default().nowPlayingInfo = nil
```
<br>

### Note: 坑

1. ***newValue and oldValue always nil when observing AVPlayerItem.status***
<a href="https://bugs.swift.org/browse/SR-5872" target="_">https://bugs.swift.org/browse/SR-5872</a>

2. ***Issue with updating playback time in MPNowPlayingInfoCenter from AVPlayer player periodic time observer block***
<a href="https://stackoverflow.com/questions/60192939/issue-with-updating-playback-time-in-mpnowplayinginfocenter-from-avplayer-player/63982763#63982763" target="_">stackoverflow</a>
<a href="https://developer.apple.com/forums/thread/32475" target="_">Apple Developer</a>

<br>

### Note: 其他說明

1. AVPlayer 是不支持播放本地的 m3u8 檔案的.

2. 某些機型於 AVPlayer 暫停狀態 App 進入背景，App 回到前景後，再按播放，系統不會繼續幫你下載 m3u8 內網址的內容，導致無法繼續播放，解法是把整個 AVPlayer 換掉. 或者是 replaceCurrentItem.

打完 搞定 收工