import pandas as pd

# Open the CSV file and search it for the given plus_code
# Return the results if found
def database(plus_code):
    data = pd.read_csv('recommender/data/places.csv', index_col=0)
    return search(data, plus_code)

# Perform a search on the database
# If found, parse the results and return them
def search(data, plus_code):
    print('Performing Database search ...')

    codes = data['plus_code'].values
    for index in range(len(codes)):
        if str(codes[index]) == plus_code:
            result = {
                "subtype": str(data.at[index, 'subtype']),
                "masks": str(data.at[index, 'masks']),
                "limited_entry": str(data.at[index, 'limited_entry']),
                "early_close": str(data.at[index, 'early_close']),
                "has_early": str(data.at[index, 'has_early']),
                "delivery": str(data.at[index, 'delivery'])
            }
            print('Woo hoo ! Found !')
            return result
    return None
