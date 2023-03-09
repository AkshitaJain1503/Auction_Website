#include <bits/stdc++.h>
using namespace std;
// makes pair ai,bi for each string si
string srr[200200];
int arr[200200],brr[200200],crr[200200]; //brr[i] stores letter availaibilty arr[i] stores  letter evenness crr[i] evenness of words lacking ith letter
int n;
void build()
{
    for(int i=0;i<n;i++)
    {
        for(char c:srr[i])
        {
            arr[i]^=(1<<(c-'a'));
            brr[i]|=(1<<(c-'a'));
        }
    }
}
long long calc(int c)
{
    int k=0;
    for(int i=0;i<n;i++)
    {
        if((brr[i]>>c & 1)^1)
        crr[k++]=arr[i];
    }
    sort(crr,crr+k);
    int mask = ((1 << 26) - 1) ^ (1 << c);
    long long ans=0;
    for(int i=0;i<k;i++)
    {
        auto itl = lower_bound(crr, crr + k, crr[i] ^ mask);
		auto itr = upper_bound(crr, crr + k, crr[i] ^ mask);
		ans += itr - itl;
    }
    return ans ;
}
void solve()
{
    int i,j;
    cin>>n;
    for(i=0;i<n;i++)
    {
        cin>>srr[i];
    }
    build();
    long long ans = 0;
	for (int c = 0; c < 26; ++c)
		ans += calc(c);
        cout<<ans<<endl;
}
int main()
{
    long long i,t;
    //cin>>t;
    t=1;
    for(i=0;i<t;i++)
    {
        solve();
    }
}