from flask_api import FlaskAPI
import flask
from flask_cors import CORS
import urllib2
from bs4 import BeautifulSoup

app = FlaskAPI(__name__)
CORS(app)

@app.route('/api/v1/stocks/<symbol>/', methods=["GET"])
def get_stock(symbol):
    context = {}

    history_page = 'https://finance.yahoo.com/quote/%s/history?p=%s' % (symbol, symbol)
    page = urllib2.urlopen(history_page)
    soup = BeautifulSoup(page, 'html.parser')

    table = soup.tbody.find_all('tr')

    price_now = float(table[0].find_all('span')[4].string.replace(',', ''))
    price_1d = float(table[1].find_all('span')[4].string.replace(',', ''))
    price_1w = float(table[5].find_all('span')[4].string.replace(',', ''))
    price_1m = float(table[20].find_all('span')[4].string.replace(',', ''))

    delim = soup.h1.text.find(' - ')
    name = soup.h1.text[delim + 3:]

    context['name'] = name
    context['symbol'] = symbol.upper()
    context['price'] = price_now
    context['percent_change_1d'] = ((price_now - price_1d) / price_1d) * 100
    context['percent_change_1w'] = ((price_now - price_1w) / price_1w) * 100
    context['percent_change_1m'] = ((price_now - price_1m) / price_1w) * 100

    quote_page = 'https://finance.yahoo.com/quote/%s?p=%s' % (symbol, symbol)
    page = urllib2.urlopen(quote_page)
    soup = BeautifulSoup(page, 'html.parser')

    tables = soup.find_all('tbody')
    table = tables[0].find_all('tr')
    volume = int(table[6].find_all('span')[1].string.replace(',', ''))

    table = tables[1].find_all('tr')
    market_cap = table[0].find_all('span')[1].string

    context['volume'] = volume
    context['market_cap'] = market_cap

    return flask.jsonify(**context)

if __name__ == '__main__':
    app.run(debug = True)
