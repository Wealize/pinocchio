import puppeteer, {
  LaunchOptions,
  DirectNavigationOptions,
  PageCloseOptions,
  Browser
} from 'puppeteer'
import cheerio from 'cheerio'

interface PinnochioOptions {
  puppeteerOptions: LaunchOptions
}

interface EvaluationParams {
  url: string,
  callback: (evaluator: CheerioStatic) => any
  puppeteerNavigationOptions?: DirectNavigationOptions,
  puppeteerCloseOptions?: PageCloseOptions,
}

class Pinocchio {
  private _options: PinnochioOptions = null
  private _browser: Browser = null

  constructor(options: PinnochioOptions) {
    this._options = options
  }

  public async evaluate(params: EvaluationParams): Promise<any> {
    const {
      url,
      callback,
      puppeteerNavigationOptions,
      puppeteerCloseOptions
    } = params

    if (this._browser === null) {
      await this._initPuppeteer()
    }

    const page = await this._browser.newPage()
    await page.goto(url, puppeteerNavigationOptions)

    const content = await page.content()
    await page.close(puppeteerCloseOptions)

    const $ = cheerio.load(content)

    return callback($)
  }

  private async _initPuppeteer() {
    const { puppeteerOptions } = this._options
    this._browser = await puppeteer.launch(puppeteerOptions)
  }
}

export default Pinocchio
