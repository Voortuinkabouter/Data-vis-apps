import numpy as np


from scipy.stats import binned_statistic
import pandas as pd


# Generate 100 random numbers between 0 and 1
data = np.random.rand(100)



# Create histogram data
hist_data, bin_edges = np.histogram(data)

# Create frequency data
bin_edges2 = bin_edges[1:]

print(bin_edges)

print(hist_data)

df = pd.DataFrame()
df['bins'] = bin_edges2
df['frequency'] = hist_data



