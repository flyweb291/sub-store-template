const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.forEach(i => {
  if (['♻️ 自动选择', '👉 手动选择'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (i.tag === '🇭🇰 香港节点' || i.tag === '🇭🇰 香港自动') {
    i.outbounds.push(...getTags(proxies, /港|hk|hongkong|hong kong|🇭🇰/i))
  }
  if (i.tag === '🇹🇼 台湾节点' || i.tag === '🇹🇼 台湾自动') {
    i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i))
  }
  if (i.tag === '🇯🇵 日本节点' || i.tag === '🇯🇵 日本自动') {
    i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i))
  }
  if (i.tag === '🇸🇬 狮城节点' || i.tag === '🇸🇬 狮城自动') {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新加坡|新|sg|singapore|狮城|🇸🇬)/i))
  }
  if (i.tag === '🇰🇷 韩国节点' || i.tag === '🇰🇷 韩国自动') {
    i.outbounds.push(...getTags(proxies, /韩国|韩|kr|korea|🇰🇷/i))
  }
  if (i.tag === '🇺🇸 美国节点' || i.tag === '🇺🇸 美国自动') {
    i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i))
  }
  if (i.tag === '🏴️ 其他节点') {
    i.outbounds.push(...getTags(proxies, null, [
      /港|hk|hongkong|hong kong|🇭🇰/i,
      /台|tw|taiwan|🇹🇼/i,
      /日本|jp|japan|🇯🇵/i,
      /^(?!.*(?:us)).*(新加坡|新|sg|singapore|狮城|🇸🇬)/i,
      /韩国|韩|kr|korea|🇰🇷/i,
      /美|us|unitedstates|united states|🇺🇸/i,
    ]))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag)
  }
})

$content = JSON.stringify(config, null, 2)

function getTags(proxies, include, excludeList) {
  if (excludeList) {
    return proxies
      .filter(p => !excludeList.some(re => re.test(p.tag)))
      .map(p => p.tag)
  }
  return (include ? proxies.filter(p => include.test(p.tag)) : proxies).map(p => p.tag)
}
